import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CalendarDays,
  ChevronDown,
  Clock3,
  Languages,
  Loader2,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import {
  deleteLearningSession,
  getStudentSessions,
} from "../lib/sessions";

type Session = {
  id: string;
  question: string;
  answer: string | null;
  class_level: string | null;
  subject: string | null;
  language: string | null;
  learning_mode: string | null;
  created_at: string;
};

function LearningHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentSessions();

      setSessions(data as Session[]);

      if (data.length > 0) {
        setSelectedSession(data[0] as Session);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load your learning history.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    const confirmed = window.confirm(
      "Delete this learning session from your history?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(sessionId);
      setError("");

      await deleteLearningSession(sessionId);

      const remaining = sessions.filter(
        (session) => session.id !== sessionId,
      );

      setSessions(remaining);

      if (selectedSession?.id === sessionId) {
        setSelectedSession(remaining[0] ?? null);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete this session.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const statistics = useMemo(() => {
    const subjects = new Set(
      sessions
        .map((session) => session.subject)
        .filter(Boolean),
    );

    const languages = new Set(
      sessions
        .map((session) => session.language)
        .filter(Boolean),
    );

    const modes = new Set(
      sessions
        .map((session) => session.learning_mode)
        .filter(Boolean),
    );

    return {
      total: sessions.length,
      subjects: subjects.size,
      languages: languages.size,
      modes: modes.size,
    };
  }, [sessions]);

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050507] text-white">
      <Navbar currentPage="student" />

      <main className="mx-auto w-[calc(100%-28px)] max-w-[1280px] pb-12 pt-8 md:w-[calc(100%-56px)] md:pb-16 md:pt-12">
        <div className="mb-8">
          <button
            onClick={() => {
              window.location.href = "/student";
            }}
            className="mb-5 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to dashboard
          </button>

          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08]">
              <BookOpen className="h-4 w-4 text-violet-200" />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200/70">
              Learning history
            </span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
                Your learning trail.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40 md:text-base">
                Review the questions you explored with VernacAI and
                revisit what you learned.
              </p>
            </div>

            <button
              onClick={() => {
                window.location.href = "/student/tutor";
              }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-4 py-2.5 text-xs font-medium text-white transition hover:border-violet-300/30 hover:bg-violet-400/[0.14]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ask Tutor
            </button>
          </div>
        </div>

        {/* STATISTICS */}
        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[24px] border border-white/[0.08] bg-[#0a0a0f]/80 p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/[0.08]">
              <Brain className="h-4 w-4 text-violet-200/70" />
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              {statistics.total}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/25">
              Sessions
            </p>
          </div>

          <div className="rounded-[24px] border border-white/[0.08] bg-[#0a0a0f]/80 p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/[0.06]">
              <BookOpen className="h-4 w-4 text-cyan-200/60" />
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              {statistics.subjects}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/25">
              Subjects
            </p>
          </div>

          <div className="rounded-[24px] border border-white/[0.08] bg-[#0a0a0f]/80 p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/[0.06]">
              <Languages className="h-4 w-4 text-emerald-200/60" />
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              {statistics.languages}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/25">
              Languages
            </p>
          </div>

          <div className="rounded-[24px] border border-white/[0.08] bg-[#0a0a0f]/80 p-5 backdrop-blur-xl">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/[0.06]">
              <Target className="h-4 w-4 text-amber-200/60" />
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              {statistics.modes}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/25">
              Learning modes
            </p>
          </div>
        </section>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-300/10 bg-red-400/[0.05] px-4 py-3">
            <p className="text-xs leading-5 text-red-200/70">
              {error}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80">
            <div className="text-center">
              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-violet-300/70" />
              <p className="text-xs text-white/30">
                Loading your learning history...
              </p>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80 p-8 text-center md:p-16">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-400/[0.06]">
              <Sparkles className="h-6 w-6 text-violet-200/60" />
            </div>

            <h2 className="text-xl font-semibold tracking-tight">
              Your learning history is empty.
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
              Ask VernacAI a question and your completed learning
              sessions will appear here.
            </p>

            <button
              onClick={() => {
                window.location.href = "/student/tutor";
              }}
              className="mt-6 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-violet-400/[0.14]"
            >
              Start learning
            </button>
          </div>
        ) : (
          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            {/* SESSION LIST */}
            <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80 backdrop-blur-xl">
              <div className="border-b border-white/[0.07] px-5 py-4 md:px-6">
                <p className="text-sm font-medium text-white">
                  Recent sessions
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                  {sessions.length} saved interactions
                </p>
              </div>

              <div className="max-h-[650px] overflow-y-auto p-3">
                {sessions.map((session) => {
                  const active =
                    selectedSession?.id === session.id;

                  return (
                    <button
                      key={session.id}
                      onClick={() =>
                        setSelectedSession(session)
                      }
                      className={`mb-2 w-full rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-violet-300/20 bg-violet-400/[0.08]"
                          : "border-white/[0.05] bg-white/[0.015] hover:border-white/[0.10] hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                            <Brain className="h-3.5 w-3.5 text-violet-200/60" />
                          </div>

                          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                            {session.subject || "Learning"}
                          </span>
                        </div>

                        <span className="shrink-0 text-[9px] text-white/20">
                          {session.class_level || "Class"}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-sm leading-6 text-white/65">
                        {session.question}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-violet-300/10 bg-violet-400/[0.05] px-2.5 py-1 text-[9px] text-violet-200/50">
                          {session.learning_mode || "Explain"}
                        </span>

                        <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-[9px] text-white/25">
                          {session.language || "English"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SESSION DETAIL */}
            <div className="min-h-[500px] overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80 backdrop-blur-xl">
              {selectedSession ? (
                <>
                  <div className="border-b border-white/[0.07] px-5 py-5 md:px-7">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-violet-300/10 bg-violet-400/[0.05] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-violet-200/55">
                        {selectedSession.learning_mode || "Explain"}
                      </span>

                      <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-white/30">
                        {selectedSession.subject || "Learning"}
                      </span>

                      <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-white/30">
                        {selectedSession.language || "English"}
                      </span>
                    </div>

                    <h2 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-white md:text-3xl">
                      {selectedSession.question}
                    </h2>

                    <div className="mt-4 flex items-center gap-2 text-[10px] text-white/25">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(selectedSession.created_at)}
                    </div>
                  </div>

                  <div className="p-5 md:p-7">
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-violet-300/60" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/25">
                        VernacAI response
                      </span>
                    </div>

                    <div className="rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-5">
                      <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                        {selectedSession.answer ||
                          "No answer was stored for this session."}
                      </p>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Clock3 className="h-3.5 w-3.5 text-cyan-200/50" />
                          <span className="text-[9px] uppercase tracking-[0.14em] text-white/20">
                            Session
                          </span>
                        </div>
                        <p className="text-xs text-white/45">
                          {selectedSession.class_level || "Not specified"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <Languages className="h-3.5 w-3.5 text-emerald-200/50" />
                          <span className="text-[9px] uppercase tracking-[0.14em] text-white/20">
                            Language
                          </span>
                        </div>
                        <p className="text-xs text-white/45">
                          {selectedSession.language || "English"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(selectedSession.id)
                      }
                      disabled={
                        deletingId === selectedSession.id
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-300/10 bg-red-400/[0.04] px-4 py-2.5 text-[10px] uppercase tracking-[0.12em] text-red-200/50 transition hover:border-red-300/20 hover:bg-red-400/[0.07] hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deletingId === selectedSession.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      Delete session
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[500px] items-center justify-center text-center">
                  <div>
                    <ChevronDown className="mx-auto mb-3 h-5 w-5 rotate-[-90deg] text-white/20" />
                    <p className="text-sm text-white/35">
                      Select a learning session.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default LearningHistory;
