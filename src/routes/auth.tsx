import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAccount } from "@/lib/signup";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — Portal ACCEB" },
      { name: "description", content: "Crie sua conta ou entre para acessar os painéis da ACCEB." },
      { property: "og:title", content: "Entrar ou criar conta — Portal ACCEB" },
      { property: "og:description", content: "Crie sua conta ou entre para acessar os painéis da ACCEB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [confirmation, setConfirmation] = useState("");
  const [confirmEmail, setConfirmEmail] = useState(false);

  function changeMode(next: "login" | "signup") {
    setMode(next);
    setError(null);
    setPassword("");
    setConfirmation("");
    setConfirmEmail(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup" && password !== confirmation) return setError("As senhas não coincidem.");
    setLoading(true);
    try {
      if (mode === "signup") {
        const result = await registerAccount(supabase.auth, email, password, window.location.origin);
        setPassword("");
        setConfirmation("");
        if (result === "confirm-email") {
          setConfirmEmail(true);
          return;
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (loginError) {
          setError(loginError.code === "email_not_confirmed" ? "Confirme seu e-mail antes de entrar. Confira também a caixa de spam." : "E-mail ou senha incorretos.");
          return;
        }
      }
      await navigate({ to: "/portal", replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="portal-bg flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">ACCEB · Centro Médico</p>
        <h1 className="mt-2 font-display text-3xl text-foreground">{confirmEmail ? "Confirme seu e-mail" : mode === "signup" ? "Crie sua conta" : "Bem-vinda de volta"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{confirmEmail ? `Enviamos um link de confirmação para ${email}. Confira sua caixa de entrada e o spam; depois volte para entrar.` : mode === "signup" ? "A primeira conta cadastrada será a administradora. As próximas contas terão acesso aos setores liberados pela administração." : "Entre para ver os painéis da empresa."}</p>
        {confirmEmail ? <Button className="mt-6 w-full" onClick={() => changeMode("login")}>Voltar para entrar</Button> : <>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" required disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={mode === "signup" ? 6 : undefined} required disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {mode === "signup" && <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirmar senha</Label>
            <Input id="confirm-password" type="password" autoComplete="new-password" minLength={6} required disabled={loading} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
          </div>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (mode === "signup" ? "Criando conta..." : "Entrando...") : mode === "signup" ? "Cadastrar" : "Entrar"}
          </Button>
        </form>
        <Button variant="link" className="mt-3 w-full" disabled={loading} onClick={() => changeMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Criar conta" : "Já tenho conta — entrar"}</Button>
        </>}
      </div>
    </main>
  );
}
