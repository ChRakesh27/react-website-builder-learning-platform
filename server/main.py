from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import re
import uvicorn

try:
    from .agent import agent
    from .database import create_employee, get_employee, get_employees
except ImportError:
    from agent import agent
    from database import create_employee, get_employee, get_employees

app = FastAPI()

# Allow CORS for local development and frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    owner_id: str | None = None
    access_token: str | None = None
    history: list[dict[str, str]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str


def _extract_employee_ref(message: str) -> str | None:
    """Extract a likely employee lookup value from a chat message."""
    text = message.strip()

    patterns = [
        r"(?:get|show|find|fetch|open|view)\s+(?:employee|employees)\s*[:=]\s*([^\n,]+)",
        r"(?:employee|employee name|name)\s*[:=]\s*([^\n,]+)",
        r"(?:email)\s*[:=]\s*([^\n,]+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()

    return None


def _is_employee_count_request(message: str) -> bool:
    """Return True when a message asks for the employee list or count."""
    text = message.strip().lower()

    count_phrases = (
        "total employees",
        "how many employees",
        "number of employees",
        "list employees",
        "show employees",
        "employees are there",
        "how many employess",
        "how many employee",
        "employee count",
        "employee list",
    )
    if any(phrase in text for phrase in count_phrases):
        return True

    # Catch small typos like "employess" or "emploees" after a count-style question.
    if re.search(r"\b(how many|number of|count of|list|show)\b.*\bempl\w*\b", text):
        return True

    return False

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    print("[chat] incoming request:", {
        "message": request.message,
        "owner_id": request.owner_id,
        "has_access_token": bool(request.access_token),
        "history_count": len(request.history),
    })

    normalized_message = request.message.strip().lower()

    if any(
        phrase in normalized_message
        for phrase in (
            "get employee",
            "show employee",
            "find employee",
            "fetch employee",
            "view employee",
            "employee details",
            "employee detail",
        )
    ):
        try:
            employee_ref = _extract_employee_ref(request.message)
            if not employee_ref and request.message.strip().isdigit():
                employee_ref = request.message.strip()

            if not employee_ref:
                return ChatResponse(
                    reply=(
                        "Please provide an employee id, name, or email. "
                        "Example: get employee 12 or get employee name: Pooja"
                    )
                )

            employee = get_employee(
                employee_ref,
                owner_id=request.owner_id,
                access_token=request.access_token,
            )
            if not employee:
                return ChatResponse(reply=f"No employee found for: {employee_ref}")

            reply_lines = [
                f"Employee: {employee.get('name', 'Unknown')}",
                f"Role: {employee.get('role') or '-'}",
                f"Email: {employee.get('email') or '-'}",
                f"Phone: {employee.get('phone') or '-'}",
            ]
            return ChatResponse(reply="\n".join(reply_lines))
        except Exception as exc:
            print("[chat] employee lookup failed:", repr(exc))
            return ChatResponse(reply=f"Failed to fetch employee: {exc}")

    if normalized_message.startswith("create employee") or normalized_message.startswith("create the employee"):
        try:
            if not request.owner_id:
                print("[chat] employee create blocked: missing owner_id")
                return ChatResponse(reply="Please sign in first so I can save the employee under your workspace.")

            name_match = re.search(r"(?:name|employee name)\s*[:=]\s*([^,]+)", request.message, re.IGNORECASE)
            email_match = re.search(r"email\s*[:=]\s*([^,]+)", request.message, re.IGNORECASE)
            role_match = re.search(r"role\s*[:=]\s*([^,]+)", request.message, re.IGNORECASE)

            print("[chat] parsed employee fields:", {
                "name": name_match.group(1).strip() if name_match else None,
                "email": email_match.group(1).strip() if email_match else None,
                "role": role_match.group(1).strip() if role_match else None,
            })

            if not name_match:
                return ChatResponse(reply="Please provide the employee name, email, and role in the format: name: Pooja, email: pooja@gmail.com, role: Web Developer")

            created = create_employee(
                name=name_match.group(1).strip(),
                owner_id=request.owner_id,
                email=email_match.group(1).strip() if email_match else None,
                role=role_match.group(1).strip() if role_match else None,
                access_token=request.access_token,
            )
            print("[chat] employee created:", created)
            return ChatResponse(reply=f"Employee created: {created.get('name', 'Unknown')}")
        except Exception as exc:
            print("[chat] employee create failed:", repr(exc))
            return ChatResponse(reply=f"Failed to create employee: {exc}")

    if _is_employee_count_request(request.message):
        try:
            employees = get_employees(
                request.owner_id,
                access_token=request.access_token,
            )
            count = len(employees)
            print("[chat] employee count:", count)
            if count == 0:
                return ChatResponse(reply="There are currently no employees.")

            names = []
            for employee in employees[:10]:
                label = employee.get("name") or employee.get("email") or "Unnamed employee"
                names.append(f"- {label}")

            suffix = "" if count <= 10 else f"\n- ...and {count - 10} more"
            return ChatResponse(reply=f"There are {count} employee(s).\n" + "\n".join(names) + suffix)
        except Exception as exc:
            print("[chat] employee count failed:", repr(exc))
            return ChatResponse(reply=f"Failed to fetch employees: {exc}")

    history_lines = []
    for item in request.history[-5:]:
        role = item.get("role", "user").strip().lower()
        content = item.get("content", "").strip()
        if content:
            history_lines.append(f"{role}: {content}")

    prompt = request.message
    if history_lines:
        prompt = (
            "Use the recent conversation context below to answer the current message.\n"
            f"Conversation context:\n" + "\n".join(history_lines)
            + f"\n\nCurrent user message: {request.message}"
        )

    try:
        print("[chat] agent prompt:", prompt)
        result = await agent.run(prompt)
        reply = getattr(result, "output", None)
        print("[chat] agent result:", result)
        if reply is None:
            raise RuntimeError("AI agent returned no output")
        return ChatResponse(reply=str(reply))
    except Exception as exc:
        print("[chat] agent failed:", repr(exc))
        return ChatResponse(reply=f"AI error: {exc}")

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app_path = "server.main:app" if __package__ else "main:app"
    uvicorn.run(app_path, host="0.0.0.0", port=port, reload=True)
