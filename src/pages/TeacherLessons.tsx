import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Globe2,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import Navbar from "../components/Navbar";
import {
  deleteLesson,
  getTeacherLessons,
  publishLesson,
} from "../lib/lessons";

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
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

function TeacherLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = async () => {
    try {
      setLoading(true);
      setError("");
      const data = (await getTeacherLessons()) as Lesson[];
      setLessons(data);
      setSelectedLesson((current) => {
        if (current) {
          return data.find((lesson) => lesson.id === current.id) ?? data[0] ?? null;
        }
        return data[0] ?? null;
      });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load your lessons.");
    } finally {
      setLoading(false);
    }
  };

  const subjects = useMemo(
    () => ["All", ...Array.from(new Set(lessons.map((lesson) => lesson.subject)))],
    [lessons],
  );

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const matchesSearch =
        !query ||
        lesson.topic.toLowerCase().includes(query) ||
        lesson.subject.toLowerCase().includes(query) ||
        lesson.class_level.toLowerCase().includes(query);

      const matchesSubject = subjectFilter === "All" || lesson.subject === subjectFilter;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published" && lesson.is_published) ||
        (statusFilter === "Draft" && !lesson.is_published);

      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [lessons, search, subjectFilter, statusFilter]);

  const publishedCount = lessons.filter((lesson) => lesson.is_published).length;
  const draftCount = lessons.length - publishedCount;

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  const handlePublish = async (lesson: Lesson, published: boolean) => {
    try {
      setBusyId(lesson.id);
      setError("");

      const updated = (await publishLesson(lesson.id, published)) as Lesson;

      setLessons((current) =>
        current.map((item) =>
          item.id === lesson.id
            ? { ...item, ...updated, is_published: published }
            : item,
        ),
      );

      setSelectedLesson((current) =>
        current?.id === lesson.id
          ? { ...current, ...updated, is_published: published }
          : current,
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update lesson status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (lesson: Lesson) => {
    if (!window.confirm(`Delete "${lesson.topic}"? This cannot be undone.`)) return;

    try {
      setBusyId(lesson.id);
      setError("");
      await deleteLesson(lesson.id);

      setLessons((current) => current.filter((item) => item.id !== lesson.id));
      setSelectedLesson((current) => (current?.id === lesson.id ? null : current));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete lesson.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050507] text-white">
      <Navbar currentPage="teacher" />

      <main className="mx-auto w-[calc(100%-28px)] max-w-[1280px] pb-12 pt-8 md:w-[calc(100%-56px)] md:pb-16 md:pt-12">
        <div className="mb-8">
          <button
            onClick={() => (window.location.href = "/teacher")}
            className="mb-5 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to workspace
          </button>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08]">
                  <BookOpen className="h-4 w-4 text-violet-200" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200/70">
                  Lesson library
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Your lessons.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40 md:text-base">
                Manage generated lessons, publish them to your class, and keep your teaching content organized.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/teacher")}
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-4 py-2.5 text-xs font-medium text-white transition hover:border-violet-300/30 hover:bg-violet-400/[0.14]"
            >
              <Plus className="h-3.5 w-3.5" />
              Create lesson
              <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-red-300/10 bg-red-400/[0.05] px-4 py-3">
            <p className="text-xs leading-5 text-red-200/70">{error}</p>
            <button onClick={() => setError("")} className="text-red-200/40 transition hover:text-red-200">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-[#0a0a0f]/75 p-4">
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">Total</p>
            <p className="mt-2 text-2xl font-semibold">{lessons.length}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.07] bg-[#0a0a0f]/75 p-4">
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">Published</p>
            <p className="mt-2 text-2xl font-semibold text-violet-200">{publishedCount}</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-white/[0.07] bg-[#0a0a0f]/75 p-4 md:col-span-1">
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">Drafts</p>
            <p className="mt-2 text-2xl font-semibold text-white/70">{draftCount}</p>
          </div>
        </div>

        <div className="mb-5 rounded-[24px] border border-white/[0.07] bg-[#0a0a0f]/75 p-3 backdrop-blur-xl md:p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search lessons..."
                className="h-11 w-full rounded-xl border border-white/[0.06] bg-white/[0.025] pl-11 pr-4 text-xs text-white outline-none placeholder:text-white/20 focus:border-violet-300/20"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
              className="h-11 rounded-xl border border-white/[0.06] bg-[#0e0e14] px-4 text-xs text-white/60 outline-none focus:border-violet-300/20"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject === "All" ? "All subjects" : subject}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-xl border border-white/[0.06] bg-[#0e0e14] px-4 text-xs text-white/60 outline-none focus:border-violet-300/20"
            >
              <option value="All">All status</option>
              <option value="Published">Published</option>
              <option value="Draft">Drafts</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80">
            <div className="text-center">
              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-violet-300/70" />
              <p className="text-xs text-white/30">Loading lesson library...</p>
            </div>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80 p-10 text-center md:p-16">
            <BookOpen className="mx-auto mb-4 h-7 w-7 text-white/20" />
            <h2 className="text-lg font-semibold">
              {lessons.length === 0 ? "No lessons yet" : "No matching lessons"}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-white/30">
              {lessons.length === 0
                ? "Generate your first lesson from the teacher workspace."
                : "Try changing your search or filters."}
            </p>
            {lessons.length === 0 && (
              <button
                onClick={() => (window.location.href = "/teacher")}
                className="mt-5 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-4 py-2.5 text-xs text-white transition hover:bg-violet-400/[0.14]"
              >
                Create your first lesson
              </button>
            )}
          </div>
        ) : (
          <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80 backdrop-blur-xl">
              <div className="border-b border-white/[0.07] px-5 py-4">
                <p className="text-sm font-medium">Lesson library</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/25">
                  {filteredLessons.length} result{filteredLessons.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="max-h-[680px] overflow-y-auto p-3">
                {filteredLessons.map((lesson) => {
                  const active = selectedLesson?.id === lesson.id;
                  const busy = busyId === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`mb-2 w-full rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-violet-300/20 bg-violet-400/[0.08]"
                          : "border-white/[0.05] bg-white/[0.015] hover:border-white/[0.10] hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-white/80">{lesson.topic}</p>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] uppercase tracking-[0.08em] ${
                                lesson.is_published
                                  ? "border border-emerald-300/10 bg-emerald-400/[0.05] text-emerald-200/55"
                                  : "border border-white/[0.06] bg-white/[0.025] text-white/25"
                              }`}
                            >
                              {lesson.is_published ? "Live" : "Draft"}
                            </span>
                          </div>
                          <p className="mt-1 text-[10px] text-white/25">
                            {lesson.subject} · {lesson.class_level}
                          </p>
                        </div>
                        <ChevronRight
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            active ? "text-violet-300/70" : "text-white/15"
                          }`}
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-[9px] text-white/20">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(lesson.created_at)}
                        {busy && <Loader2 className="ml-auto h-3 w-3 animate-spin text-violet-300/60" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/80 backdrop-blur-xl">
              {selectedLesson ? (
                <>
                  <div className="border-b border-white/[0.07] px-5 py-5 md:px-7">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-violet-300/10 bg-violet-400/[0.05] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-violet-200/55">
                          {selectedLesson.subject}
                        </span>
                        <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-white/30">
                          {selectedLesson.class_level}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] ${
                          selectedLesson.is_published
                            ? "border-emerald-300/10 bg-emerald-400/[0.05] text-emerald-200/60"
                            : "border-white/[0.07] bg-white/[0.025] text-white/30"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            selectedLesson.is_published ? "bg-emerald-300/70" : "bg-white/20"
                          }`}
                        />
                        {selectedLesson.is_published ? "Published" : "Draft"}
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
                        {selectedLesson.source_language} → {selectedLesson.target_language}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5 p-5 md:p-7">
                    <div className="rounded-[24px] border border-white/[0.06] bg-white/[0.02] p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-violet-300/60" />
                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/25">
                          Lesson content
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-7 text-white/60">
                        {selectedLesson.translated_content ||
                          selectedLesson.original_content ||
                          "No lesson content available."}
                      </p>
                    </div>

                    {selectedLesson.translated_content && selectedLesson.original_content && (
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

                    <div className="rounded-[24px] border border-violet-300/10 bg-violet-400/[0.04] p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/[0.07]">
                          <Upload className="h-4 w-4 text-violet-200/70" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white/75">
                            {selectedLesson.is_published
                              ? "This lesson is live for students."
                              : "This lesson is still a draft."}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/30">
                            {selectedLesson.is_published
                              ? `Students in ${selectedLesson.class_level} can now open this lesson from their lesson library.`
                              : `Publish this lesson to make it available to students in ${selectedLesson.class_level}.`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        disabled={busyId === selectedLesson.id}
                        onClick={() => handlePublish(selectedLesson, !selectedLesson.is_published)}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-5 py-3 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          selectedLesson.is_published
                            ? "border-white/[0.08] bg-white/[0.035] text-white/55 hover:border-red-300/15 hover:bg-red-400/[0.05] hover:text-white"
                            : "border-violet-300/15 bg-violet-400/[0.09] text-white hover:border-violet-300/30 hover:bg-violet-400/[0.15]"
                        }`}
                      >
                        {busyId === selectedLesson.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : selectedLesson.is_published ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Upload className="h-3.5 w-3.5" />
                        )}
                        {selectedLesson.is_published ? "Unpublish lesson" : "Publish to students"}
                      </button>

                      <button
                        disabled={busyId === selectedLesson.id}
                        onClick={() => handleDelete(selectedLesson)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-red-300/10 bg-red-400/[0.035] px-5 py-3 text-xs text-red-200/55 transition hover:border-red-300/20 hover:bg-red-400/[0.07] hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[520px] items-center justify-center text-center">
                  <div>
                    <BookOpen className="mx-auto mb-4 h-7 w-7 text-white/15" />
                    <p className="text-sm text-white/30">Select a lesson to preview it.</p>
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

export default TeacherLessons;
