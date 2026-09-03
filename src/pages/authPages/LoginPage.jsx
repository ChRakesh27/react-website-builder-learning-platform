import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../api/auth.js";
import { Button } from "../../components/ui/button.jsx";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../../components/ui/card.jsx";
import { Input } from "../../components/ui/input.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signIn");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); setError(""); setMessage("");
    const action = mode === "signIn" ? auth.signIn : auth.signUp;
    const { error: authError } = await action({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (mode === "signIn") { setMessage("Login successful. Redirecting..."); navigate("/"); }
    else { setMessage("Registration successful. Check your email if confirmation is enabled."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur animate-fade-in">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">Supabase Auth</p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              {mode === "signIn" ? "Login" : "Register"} with email and password
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Use your Supabase project credentials to sign in or create a new account.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">Email sign-in</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">Password auth</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">Supabase session</span>
            </div>
          </div>

          <Card className="border-slate-200/80 bg-white text-slate-950 shadow-2xl shadow-slate-950/10 animate-scale-in">
            <CardHeader>
              <CardTitle>{mode === "signIn" ? "Login" : "Register"}</CardTitle>
              <CardDescription>Enter your email ID and password to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Email Id
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="email" required />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Password
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required />
                </label>
                {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">{error}</p>}
                {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 animate-fade-in">{message}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (mode === "signIn" ? "Signing in..." : "Creating account...") : (mode === "signIn" ? "Login" : "Register")}
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={() => { setMode((c) => c === "signIn" ? "signUp" : "signIn"); setError(""); setMessage(""); }}>
                  {mode === "signIn" ? "Need an account? Register" : "Already have an account? Login"}
                </Button>
                <p className="text-sm leading-6 text-slate-500">Email/password auth must be enabled in your Supabase project.</p>
                <Link className="text-sm font-medium text-slate-900 underline underline-offset-4" to="/">Back to home</Link>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}