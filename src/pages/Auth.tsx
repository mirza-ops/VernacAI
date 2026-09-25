import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
  Lock,
  Mail,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { supabase } from "../lib/supabase";

type Role = "student" | "teacher";

function Auth() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [role, setRole] = useState<Role>("student");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await redirectUser(session.user.id);
      }
    };

    checkSession();
  }, []);

  const redirectUser = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profile?.role === "teacher") {
      window.location.href = "/teacher";
      return;
    }

    window.location.href = "/student";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Please enter your email and password.");
      }

      if (mode === "signup") {
        if (!fullName.trim()) {
          throw new Error("Please enter your full name.");
        }

        if (password.length < 6) {
          throw new Error("Password must contain at least 6 characters.");
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              role,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (!data.session) {
          setMessage(
            "Account created. Check your email to confirm your account, then log in.",
          );
          setLoading(false);
          return;
        }

        await redirectUser(data.user!.id);
        return;
      }

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error("Unable to sign in. Please try again.");
      }

      await redirectUser(data.user.id);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full bg-violet-500/[0.10] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "radial-gradient(circle at center, black 20%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 20%, transparent 80%)",
          }}
        />
      </div>

      {/* Top brand */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] justify-center px-5 pt-8 md:justify-start md:px-8">
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/[0.08]">
            <Sparkles className="h-4 w-4 text-violet-200" />

            <motion.div
              animate={{
                opacity: [0.15, 0.5, 0.15],
                scale: [0.85, 1.1, 0.85],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-xl bg-violet-400/20 blur-md"
            />
          </div>

          <div className="text-left">
            <div className="text-sm font-semibold tracking-tight">
              VernacAI
            </div>

            <div className="mt-0.5 text-[8px] uppercase tracking-[0.22em] text-white/35">
              Vernacular intelligence
            </div>
          </div>
        </button>
      </div>

      {/* Auth area */}
      <div className="relative z-10 flex min-h-[calc(100vh-90px)] items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-[470px]"
        >
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/45 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300" />
              Learning intelligence
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.045em] md:text-5xl">
              {mode === "login" ? "Welcome back." : "Start learning."}
            </h1>

            <p className="mx-auto mt-3 max-w-[360px] text-sm leading-6 text-white/40">
              {mode === "login"
                ? "Continue your vernacular learning experience."
                : "Create your VernacAI account and choose your learning role."}
            </p>
          </div>

          {/* Card */}
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.10] bg-[#0a0a0f]/80 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-7">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-violet-500/[0.06] blur-3xl" />

            {/* Mode toggle */}
            <div className="relative mb-7 grid grid-cols-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
                className={`rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                  mode === "login"
                    ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "text-white/35 hover:text-white/60"
                }`}
              >
                Sign in
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setMessage("");
                }}
                className={`rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                  mode === "signup"
                    ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "text-white/35 hover:text-white/60"
                }`}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-4">
              {/* Full name */}
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-white/35">
                    Full name
                  </label>

                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Your name"
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-300/30 focus:bg-white/[0.05]"
                    />
                  </div>
                </div>
              )}

              {/* Role */}
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-white/35">
                    I am joining as
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`rounded-2xl border p-4 text-left transition ${
                        role === "student"
                          ? "border-violet-300/30 bg-violet-400/[0.09]"
                          : "border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.05]"
                      }`}
                    >
                      <GraduationCap
                        className={`mb-3 h-5 w-5 ${
                          role === "student"
                            ? "text-violet-200"
                            : "text-white/35"
                        }`}
                      />

                      <div className="text-xs font-medium">Student</div>

                      <div className="mt-1 text-[10px] leading-4 text-white/30">
                        Learn with AI
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("teacher")}
                      className={`rounded-2xl border p-4 text-left transition ${
                        role === "teacher"
                          ? "border-violet-300/30 bg-violet-400/[0.09]"
                          : "border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.05]"
                      }`}
                    >
                      <Users
                        className={`mb-3 h-5 w-5 ${
                          role === "teacher"
                            ? "text-violet-200"
                            : "text-white/35"
                        }`}
                      />

                      <div className="text-xs font-medium">Teacher</div>

                      <div className="mt-1 text-[10px] leading-4 text-white/30">
                        Create lessons
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-white/35">
                  Email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-300/30 focus:bg-white/[0.05]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-white/35">
                  Password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-300/30 focus:bg-white/[0.05]"
                  />
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 text-xs leading-5 text-red-200/80">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3 text-xs leading-5 text-emerald-200/80">
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/[0.12] text-xs font-medium text-white transition hover:border-violet-300/35 hover:bg-violet-400/[0.17] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}

                {!loading && (
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-white/25">
              <Lock className="h-3 w-3" />
              Secure authentication powered by Supabase
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default Auth;