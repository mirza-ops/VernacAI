import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Globe2,
  Loader2,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getAvailableLessons } from "../lib/lessons";

type Lesson = {
  id: string;
  teacher_id: string | null;
  topic: string;
  subject: string;
  class_level: string;
  source_language: string;
  target_language: string;
  original_content: string | null;
  translated_content: string | null;
  created_at: string;
};

function StudentLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] =
    useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAvailableLessons();

      setLessons(data as Lesson[]);

      if (data.length > 0) {
        setSelectedLesson(data[0] as Lesson);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load lessons.",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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
              Teacher lessons
            </span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Learn from your class.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40 md:text-base">
                Lessons created by your teachers, adapted for your
                class and available in your learning language.
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
                Loading your lessons...
              </p>
            </div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80 p-8 text-center md:p-16">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-400/[0.06]">
              <BookOpen className="h-6 w-6 text-violet-200/60" />
            </div>

            <h2 className="text-xl font-semibold tracking-tight">
              No class lessons yet.
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
              When your teacher creates a lesson for your class,
              it will appear here automatically.
            </p>
          </div>
        ) : (
          <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            {/* LESSON LIST */}
            <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80 backdrop-blur-xl">
              <div className="border-b border-white/[0.07] px-5 py-4 md:px-6">
                <p className="text-sm font-medium text-white">
                  Available lessons
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
                  {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="max-h-[650px] overflow-y-auto p-3">
                {lessons.map((lesson) => {
                  const active =
                    selectedLesson?.id === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() =>
                        setSelectedLesson(lesson)
                      }
                      className={`mb-2 w-full rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-violet-300/20 bg-violet-400/[0.08]"
                          : "border-white/[0.05] bg-white/[0.015] hover:border-white/[0.10] hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white/75">
                            {lesson.topic}
                          </p>

                          <p className="mt-1 text-[10px] text-white/25">
                            {lesson.subject} · {lesson.class_level}
                          </p>
                        </div>

                        <ChevronRight
                          className={`mt-0.5 h-4 w-4 shrink-0 transition ${
                            active
                              ? "text-violet-300/70"
                              : "text-white/15"
                          }`}
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-violet-300/10 bg-violet-400/[0.05] px-2.5 py-1 text-[9px] text-violet-200/50">
                          {lesson.source_language}
                        </span>

                        <span className="text-white/15">
                          →
                        </span>

                        <span className="rounded-full border border-cyan-300/10 bg-cyan-400/[0.04] px-2.5 py-1 text-[9px] text-cyan-200/50">
                          {lesson.target_language}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LESSON DETAIL */}
            <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80 backdrop-blur-xl">
              {selectedLesson ? (
                <>
                  <div className="border-b border-white/[0.07] px-5 py-5 md:px-7">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-violet-300/10 bg-violet-400/[0.05] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-violet-200/55">
                        {selectedLesson.subject}
                      </span>

                      <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-white/30">
                        {selectedLesson.class_level}
                      </span>
                    </div>

                    <h2 className="text-2xl font-semibold tracking-[-0.025em] md:text-3xl">
                      {selectedLesson.topic}
                    </h2>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-white/25">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(selectedLesson.created_at)}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Globe2 className="h-3.5 w-3.5" />
                        {selectedLesson.source_language} →{" "}
                        {selectedLesson.target_language}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 p-5 md:p-7">
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-violet-300/60" />
                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/25">
                          Lesson
                        </span>
                      </div>

                      <div className="rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-5">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                          {selectedLesson.translated_content ||
                            selectedLesson.original_content ||
                            "No lesson content available."}
                        </p>
                      </div>
                    </div>

                    {selectedLesson.translated_content &&
                      selectedLesson.original_content && (
                        <details className="group rounded-[22px] border border-white/[0.06] bg-white/[0.015]">
                          <summary className="cursor-pointer list-none px-5 py-4 text-[10px] uppercase tracking-[0.14em] text-white/30">
                            View original content
                          </summary>

                          <div className="border-t border-white/[0.06] px-5 py-4">
                            <p className="whitespace-pre-wrap text-xs leading-6 text-white/40">
                              {selectedLesson.original_content}
                            </p>
                          </div>
                        </details>
                      )}

                    <button
                      onClick={() => {
                        sessionStorage.setItem(
                          "vernacai_lesson_context",
                          selectedLesson.translated_content ||
                            selectedLesson.original_content ||
                            "",
                        );
                        sessionStorage.setItem(
                          "vernacai_lesson_topic",
                          selectedLesson.topic,
                        );
                        window.location.href = "/student/tutor";
                      }}
                      className="group inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-5 py-3 text-xs font-medium text-white transition hover:border-violet-300/30 hover:bg-violet-400/[0.14]"
                    >
                      Ask VernacAI about this lesson
                      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[500px] items-center justify-center text-center">
                  <p className="text-sm text-white/30">
                    Select a lesson to begin.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default StudentLessons;
