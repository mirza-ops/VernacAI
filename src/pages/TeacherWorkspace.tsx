import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  FileText,
  Globe2,
  GraduationCap,
  Loader2,
  Save,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { saveLesson } from "../lib/lessons";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const languages = [
  "English",
  "Telugu",
  "Hindi",
  "Tamil",
  "Kannada",
  "Malayalam",
];

const languageCodes: Record<string, string> = {
  English: "en-IN",
  Telugu: "te-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
};

const subjects = [
  "Science",
  "Mathematics",
  "English",
  "Social Studies",
  "EVS",
];

function TeacherWorkspace() {
  const [classLevel, setClassLevel] =
    useState("Class 5");

  const [subject, setSubject] =
    useState("Science");

  const [topic, setTopic] =
    useState("Photosynthesis");

  const [sourceLanguage, setSourceLanguage] =
    useState("English");

  const [targetLanguage, setTargetLanguage] =
    useState("Telugu");

  const [lesson, setLesson] =
    useState("");

  // Keeps the original AI-generated lesson
  // even after translation.
  const [originalLesson, setOriginalLesson] =
    useState("");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [generated, setGenerated] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  // --------------------------------------------------
  // GENERATE LESSON
  // --------------------------------------------------

  const generateLesson = async () => {
    if (!topic.trim()) {
      setError("Please enter a lesson topic.");
      return;
    }

    setError("");
    setIsGenerating(true);
    setGenerated(false);
    setSaved(false);

    try {
      const response = await fetch(
        `${API_URL}/generate-lesson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topic.trim(),
            subject,
            class_level: classLevel,
            source_language: sourceLanguage,
            target_language: targetLanguage,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            "Lesson generation failed.",
        );
      }

      const generatedLesson =
        result?.data?.lesson || "";

      if (!generatedLesson) {
        throw new Error(
          "Gemini returned an empty lesson.",
        );
      }

      setLesson(generatedLesson);
      setOriginalLesson(generatedLesson);
      setGenerated(true);
      setSaved(false);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Lesson generation failed.";

      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  // --------------------------------------------------
  // TRANSLATE LESSON
  // --------------------------------------------------

  const translateLesson = async () => {
    if (!lesson.trim()) {
      setError(
        "Generate a lesson before translating it.",
      );
      return;
    }

    if (
      sourceLanguage ===
      targetLanguage
    ) {
      setError(
        "Source and target languages are the same.",
      );
      return;
    }

    setError("");
    setIsGenerating(true);
    setSaved(false);

    try {
      const response = await fetch(
        `${API_URL}/translate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: originalLesson || lesson,
            source_language:
              languageCodes[
                sourceLanguage
              ] || "en-IN",
            target_language:
              languageCodes[
                targetLanguage
              ] || "te-IN",
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            "Translation failed.",
        );
      }

      const translatedText =
        result?.data?.translated_text ||
        "";

      if (!translatedText) {
        throw new Error(
          "Translation returned empty text.",
        );
      }

      setLesson(translatedText);
      setGenerated(true);
      setSaved(false);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Translation failed.";

      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  // --------------------------------------------------
  // SAVE LESSON
  // --------------------------------------------------

  const handleSaveLesson = async () => {
    if (!lesson.trim()) {
      setError(
        "Generate or translate a lesson before saving.",
      );
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const isTranslated =
        targetLanguage !== sourceLanguage &&
        lesson !== originalLesson;

      await saveLesson({
        topic: topic.trim(),
        subject,
        classLevel,
        sourceLanguage,
        targetLanguage,
        originalContent:
          originalLesson || lesson,
        translatedContent:
          isTranslated ? lesson : undefined,
      });

      setSaved(true);
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Unable to save lesson.";

      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------------------------------
  // NEW LESSON
  // --------------------------------------------------

  const resetLesson = () => {
    setLesson("");
    setOriginalLesson("");
    setGenerated(false);
    setSaved(false);
    setError("");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050507] text-white">
      <Navbar currentPage="teacher" />

      <main className="mx-auto w-[calc(100%-28px)] max-w-[1280px] pb-16 pt-8 md:w-[calc(100%-56px)] md:pt-12">

        {/* --------------------------------------------------
            HEADER
        -------------------------------------------------- */}

        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="mb-5 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </button>

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-400/[0.07]">
                <GraduationCap className="h-4 w-4 text-cyan-200" />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200/60">
                Teacher Workspace
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-white md:text-6xl">
              Create lessons that
              <span className="block bg-gradient-to-r from-white via-violet-200 to-violet-500 bg-clip-text text-transparent">
                speak their language.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40 md:text-base">
              Generate age-appropriate educational
              content and localize it for students
              learning in their mother tongue.
            </p>
          </div>
          <button
  onClick={() => {
    window.location.href = "/teacher/lessons";
  }}
  className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/55 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-white"
>
  <BookOpen className="h-3.5 w-3.5" />
  My Lessons
</button>

          <div className="flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-400/[0.05] px-3 py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-200/70">
              Workspace ready
            </span>
          </div>
        </div>

        {/* --------------------------------------------------
            WORKSPACE GRID
        -------------------------------------------------- */}

        <div className="grid gap-5 lg:grid-cols-[390px_minmax(0,1fr)]">

          {/* ------------------------------------------------
              CONFIGURATION
          ------------------------------------------------ */}

          <section className="rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/85 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-6">

            <div className="mb-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.08]">
                <WandSparkles className="h-4 w-4 text-violet-200" />
              </div>

              <h2 className="text-lg font-semibold tracking-tight text-white">
                Lesson configuration
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/30">
                Define the learning context before
                generating the lesson.
              </p>
            </div>

            <div className="space-y-5">

              {/* CLASS */}

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Class level
                </span>

                <div className="relative">
                  <select
                    value={classLevel}
                    onChange={(event) =>
                      setClassLevel(
                        event.target.value,
                      )
                    }
                    className="w-full appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition focus:border-violet-300/25"
                  >
                    {Array.from(
                      { length: 8 },
                      (_, index) =>
                        `Class ${index + 1}`,
                    ).map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-[#0a0a0f]"
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                </div>
              </label>

              {/* SUBJECT */}

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Subject
                </span>

                <div className="relative">
                  <select
                    value={subject}
                    onChange={(event) =>
                      setSubject(
                        event.target.value,
                      )
                    }
                    className="w-full appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition focus:border-violet-300/25"
                  >
                    {subjects.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-[#0a0a0f]"
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                </div>
              </label>

              {/* TOPIC */}

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Lesson topic
                </span>

                <input
                  value={topic}
                  onChange={(event) =>
                    setTopic(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Photosynthesis"
                  className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-violet-300/25"
                />
              </label>

              {/* SOURCE LANGUAGE */}

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Source language
                </span>

                <div className="relative">
                  <select
                    value={sourceLanguage}
                    onChange={(event) =>
                      setSourceLanguage(
                        event.target.value,
                      )
                    }
                    className="w-full appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 text-sm text-white outline-none transition focus:border-violet-300/25"
                  >
                    {languages.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-[#0a0a0f]"
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                </div>
              </label>

              {/* TARGET LANGUAGE */}

              <label className="block">
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Student language
                </span>

                <div className="relative">
                  <select
                    value={targetLanguage}
                    onChange={(event) =>
                      setTargetLanguage(
                        event.target.value,
                      )
                    }
                    className="w-full appearance-none rounded-2xl border border-violet-300/15 bg-violet-400/[0.04] px-4 py-3.5 text-sm text-white outline-none transition focus:border-violet-300/30"
                  >
                    {languages.map((item) => (
                      <option
                        key={item}
                        value={item}
                        className="bg-[#0a0a0f]"
                      >
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                </div>
              </label>

              {/* GENERATE */}

              <button
                onClick={generateLesson}
                disabled={isGenerating}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-300/20 bg-violet-400/[0.12] px-5 py-3.5 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_15px_40px_rgba(139,92,246,0.08)] transition hover:border-violet-300/35 hover:bg-violet-400/[0.17] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-violet-200" />
                    Generate lesson
                  </>
                )}
              </button>

              {error && (
                <div className="rounded-2xl border border-red-300/10 bg-red-400/[0.05] px-4 py-3">
                  <p className="text-xs leading-5 text-red-200/70">
                    {error}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ------------------------------------------------
              LESSON PREVIEW
          ------------------------------------------------ */}

          <section className="min-h-[650px] rounded-[30px] border border-white/[0.08] bg-[#0a0a0f]/85 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-xl">

            {/* PREVIEW HEADER */}

            <div className="flex flex-col gap-4 border-b border-white/[0.07] px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-400/[0.06]">
                  <FileText className="h-4 w-4 text-cyan-200/80" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Lesson preview
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/25">
                    AI generated material
                  </p>
                </div>
              </div>

              {generated && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-300/10 bg-emerald-400/[0.05] px-3 py-1.5">
                    <Check className="h-3 w-3 text-emerald-300/70" />

                    <span className="text-[9px] uppercase tracking-[0.14em] text-emerald-200/60">
                      Generated
                    </span>
                  </div>

                  {saved && (
                    <div className="flex items-center gap-1.5 rounded-full border border-violet-300/10 bg-violet-400/[0.05] px-3 py-1.5">
                      <Check className="h-3 w-3 text-violet-300/70" />

                      <span className="text-[9px] uppercase tracking-[0.14em] text-violet-200/60">
                        Saved
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PREVIEW BODY */}

            <div className="p-5 md:p-7">

              {!lesson ? (
                <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

                  <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/[0.08] bg-white/[0.025]">
                    <BookOpen className="h-7 w-7 text-white/20" />

                    <div className="absolute inset-0 rounded-[26px] bg-violet-400/[0.05] blur-2xl" />
                  </div>

                  <h3 className="text-lg font-medium text-white/65">
                    Your lesson will appear here
                  </h3>

                  <p className="mt-2 max-w-md text-xs leading-6 text-white/25">
                    Configure the class, subject,
                    topic and languages on the left,
                    then generate an AI-powered lesson.
                  </p>

                  <div className="mt-7 flex flex-wrap justify-center gap-2">
                    {[
                      "Age appropriate",
                      "Structured",
                      "Multilingual",
                      "Teacher ready",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-white/25"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>

                  {/* METADATA */}

                  <div className="mb-6 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[8px] uppercase tracking-[0.15em] text-white/20">
                        Class
                      </p>

                      <p className="mt-1 text-xs text-white/55">
                        {classLevel}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[8px] uppercase tracking-[0.15em] text-white/20">
                        Subject
                      </p>

                      <p className="mt-1 text-xs text-white/55">
                        {subject}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-violet-300/10 bg-violet-400/[0.04] p-3">
                      <p className="text-[8px] uppercase tracking-[0.15em] text-white/20">
                        Student language
                      </p>

                      <p className="mt-1 text-xs text-violet-200/70">
                        {targetLanguage}
                      </p>
                    </div>
                  </div>

                  {/* LESSON */}

                  <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.018] p-5 md:p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/[0.06]">
                        <Sparkles className="h-4 w-4 text-violet-200/70" />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-200/60">
                          Generated lesson
                        </p>

                        <p className="mt-1 text-[10px] text-white/20">
                          {topic}
                        </p>
                      </div>
                    </div>

                    <div className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                      {lesson}
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">

                    {/* LOCALIZE */}

                    <button
                      onClick={translateLesson}
                      disabled={
                        isGenerating ||
                        sourceLanguage ===
                          targetLanguage
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/15 bg-cyan-400/[0.05] px-4 py-3 text-xs font-medium text-cyan-100/70 transition hover:border-cyan-300/25 hover:bg-cyan-400/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Globe2 className="h-4 w-4" />
                      )}

                      Localize to {targetLanguage}
                    </button>

                    {/* SAVE */}

                    <button
                      onClick={handleSaveLesson}
                      disabled={isSaving || saved}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-violet-300/15 bg-violet-400/[0.06] px-4 py-3 text-xs font-medium text-violet-100/75 transition hover:border-violet-300/30 hover:bg-violet-400/[0.10] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : saved ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}

                      {isSaving
                        ? "Saving..."
                        : saved
                          ? "Saved"
                          : "Save lesson"}
                    </button>

                    {/* NEW LESSON */}

                    <button
                      onClick={resetLesson}
                      className="flex items-center justify-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs font-medium text-white/45 transition hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-white"
                    >
                      <FileText className="h-4 w-4" />

                      New lesson
                    </button>

                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* --------------------------------------------------
            WORKFLOW STRIP
        -------------------------------------------------- */}

        <section className="mt-5 rounded-[26px] border border-white/[0.07] bg-white/[0.015] p-4 md:p-5">

          <div className="grid gap-3 md:grid-cols-4">

            {[
              {
                number: "01",
                title: "Define",
                text: "Set class, subject and topic.",
              },
              {
                number: "02",
                title: "Generate",
                text: "Gemini creates structured material.",
              },
              {
                number: "03",
                title: "Localize",
                text: "Sarvam adapts content to the target language.",
              },
              {
                number: "04",
                title: "Teach",
                text: "Students learn through VernacAI Tutor.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4"
              >
                <p className="text-[9px] font-semibold tracking-[0.18em] text-violet-300/40">
                  {step.number}
                </p>

                <p className="mt-2 text-xs font-medium text-white/60">
                  {step.title}
                </p>

                <p className="mt-1 text-[10px] leading-5 text-white/20">
                  {step.text}
                </p>
              </div>
            ))}

          </div>
        </section>

      </main>
    </div>
  );
}

export default TeacherWorkspace;