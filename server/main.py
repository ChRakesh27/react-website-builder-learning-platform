from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import re
import uvicorn

try:
    from .agent import agent
    from .database import create_employee, get_employees
except ImportError:
    from agent import agent
    from database import create_employee, get_employees

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

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    print("[chat] incoming request:", {
        "message": request.message,
        "owner_id": request.owner_id,
        "has_access_token": bool(request.access_token),
        "history_count": len(request.history),
    })

    normalized_message = request.message.strip().lower()

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

    if any(
        phrase in normalized_message
        for phrase in (
            "total employees",
            "how many employees",
            "number of employees",
            "list employees",
            "show employees",
            "employees are there",
        )
    ):
        try:
            employees = get_employees(request.owner_id)
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
