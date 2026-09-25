import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  GraduationCap,
  Languages,
  Loader2,
  Mic,
  Play,
  Settings2,
  Sparkles,
  Star,
  Volume2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import {
  getMyProfile,
  updateMyStudentProfile,
} from "../lib/profile";
import { getStudentSessions } from "../lib/sessions";

const classes = Array.from(
  { length: 10 },
  (_, index) => `Class ${index + 1}`,
);

const languages = [
  "English",
  "Telugu",
  "Hindi",
  "Tamil",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Bengali",
  "Gujarati",
  "Punjabi",
  "Odia",
];

const subjectIcons: Record<string, string> = {
  Science: "✦",
  Mathematics: "÷",
  English: "Aa",
  Social: "◎",
  Telugu: "అ",
  Hindi: "अ",
};

const waveform = [
  24, 42, 31, 60, 38, 74, 48, 67, 35, 55, 28, 44, 36, 62,
];

type LearningSession = {
  id: string;
  question: string;
  answer: string | null;
  subject: string | null;
  language: string | null;
  learning_mode: string | null;
  created_at: string;
};

function StudentDashboard() {
  const [profile, setProfile] = useState<{
    full_name: string | null;
    class_level: string;
    preferred_language: string;
  } | null>(null);

  const [sessions, setSessions] = useState<LearningSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [savedProfile, setSavedProfile] = useState(false);

  const [draftClass, setDraftClass] = useState("Class 5");
  const [draftLanguage, setDraftLanguage] =
    useState("Telugu");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [studentProfile, learningSessions] =
          await Promise.all([
            getMyProfile(),
            getStudentSessions(),
          ]);

        const safeProfile = {
          full_name: studentProfile.full_name,
          class_level:
            studentProfile.class_level || "Class 5",
          preferred_language:
            studentProfile.preferred_language || "Telugu",
        };

        setProfile(safeProfile);
        setDraftClass(safeProfile.class_level);
        setDraftLanguage(safeProfile.preferred_language);
        setSessions(learningSessions as LearningSession[]);
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const saveProfile = async () => {
    try {
      setSavingProfile(true);
      setProfileError("");
      setSavedProfile(false);

      const updated = await updateMyStudentProfile(
        draftClass,
        draftLanguage,
      );

      setProfile({
        full_name: updated.full_name,
        class_level: updated.class_level,
        preferred_language:
          updated.preferred_language,
      });

      setSavedProfile(true);

      window.setTimeout(() => {
        setSavedProfile(false);
      }, 2500);
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Unable to save your profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const stats = useMemo(() => {
    const subjects = new Set(
      sessions
        .map((session) => session.subject)
        .filter(Boolean),
    );

    const languagesUsed = new Set(
      sessions
        .map((session) => session.language)
        .filter(Boolean),
    );

    return {
      sessions: sessions.length,
      subjects: subjects.size,
      languages: languagesUsed.size,
    };
  }, [sessions]);

  const recentActivity = sessions.slice(0, 4);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  const displayName =
    profile?.full_name?.trim() || "Student";

  const displayLanguage =
    profile?.preferred_language || "Telugu";

  const displayClass =
    profile?.class_level || "Class 5";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 70, -30, 0],
            y: [0, -30, 35, 0],
            scale: [1, 1.08, 0.97, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[15%] top-0 h-[600px] w-[600px] rounded-full bg-violet-600/[0.10] blur-[150px]"
        />

        <motion.div
          animate={{
            x: [0, -60, 30, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[5%] top-[25%] h-[500px] w-[500px] rounded-full bg-purple-500/[0.07] blur-[140px]"
        />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.2) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
            maskImage:
              "radial-gradient(circle at 50% 25%, black 5%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 25%, black 5%, transparent 78%)",
          }}
        />

        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black/50 to-transparent" />
      </div>

      <Navbar currentPage="student" />

      <section className="relative z-10 mx-auto max-w-[1280px] px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pt-16">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div>
            <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-violet-300/60">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
              Student workspace
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Keep learning
              <span className="text-violet-400">.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/40">
              Welcome back,{" "}
              <span className="text-white/65">
                {displayName}
              </span>
              . Your learning space adapts to your class and
              language.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-orange-300" />

                <div>
                  <div className="text-sm font-semibold">
                    7 days
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Learning streak
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setProfileOpen((value) => !value)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs transition ${
                profileOpen
                  ? "border-violet-300/20 bg-violet-400/[0.09] text-white"
                  : "border-white/[0.07] bg-white/[0.025] text-white/55 hover:text-white"
              }`}
            >
              <Settings2 size={14} />
              Learning profile
            </button>

            <button
              onClick={() => {
                window.location.href =
                  "/student/tutor";
              }}
              className="group flex items-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              <Sparkles size={15} />
              Ask VernacAI
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </motion.div>

        {/* PROFILE SETTINGS */}
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-[28px] border border-violet-300/[0.10] bg-[#0b0a10]/85 p-5 backdrop-blur-2xl md:p-6"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-violet-200/55">
                  <Languages size={12} />
                  Personal learning profile
                </div>

                <h2 className="mt-3 text-xl font-medium">
                  Tell VernacAI how to teach you.
                </h2>

                <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                  These preferences are stored in your Supabase
                  profile and used throughout your learning
                  experience.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[520px]">
                <label className="block">
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-white/25">
                    Class
                  </span>

                  <select
                    value={draftClass}
                    onChange={(event) =>
                      setDraftClass(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#0e0e14] px-3 text-xs text-white/70 outline-none focus:border-violet-300/20"
                  >
                    {classes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-white/25">
                    Preferred language
                  </span>

                  <select
                    value={draftLanguage}
                    onChange={(event) =>
                      setDraftLanguage(event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#0e0e14] px-3 text-xs text-white/70 outline-none focus:border-violet-300/20"
                  >
                    {languages.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                {profileError && (
                  <p className="text-xs text-red-300/70">
                    {profileError}
                  </p>
                )}

                {savedProfile && (
                  <p className="flex items-center gap-2 text-xs text-emerald-300/70">
                    <Check size={13} />
                    Profile saved
                  </p>
                )}
              </div>

              <button
                disabled={savingProfile}
                onClick={saveProfile}
                className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.09] px-5 py-2.5 text-xs font-medium text-white transition hover:border-violet-300/30 hover:bg-violet-400/[0.14] disabled:opacity-50"
              >
                {savingProfile && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Save preferences
              </button>
            </div>
          </motion.div>
        )}

        {/* TOP BENTO */}
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0b0a10]/75 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl lg:col-span-2"
          >
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/[0.12] blur-[80px]" />

            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-white/25">
                    <BookOpen size={12} />
                    Your learning profile
                  </div>

                  <h2 className="mt-5 text-2xl font-medium tracking-tight">
                    {displayClass}
                  </h2>

                  <p className="mt-1 text-xs text-white/35">
                    Learning in {displayLanguage}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-500/10">
                  <span className="text-lg text-violet-300">
                    ✦
                  </span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[8px] uppercase tracking-[0.12em] text-white/20">
                    Sessions
                  </p>
                  <p className="mt-2 text-lg font-medium">
                    {stats.sessions}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[8px] uppercase tracking-[0.12em] text-white/20">
                    Subjects
                  </p>
                  <p className="mt-2 text-lg font-medium">
                    {stats.subjects}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-[8px] uppercase tracking-[0.12em] text-white/20">
                    Languages
                  </p>
                  <p className="mt-2 text-lg font-medium">
                    {stats.languages}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setProfileOpen(true)}
                className="group mt-6 flex items-center gap-2 text-xs font-medium text-white/55 transition hover:text-white"
              >
                Edit learning profile
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </div>
          </motion.div>

          <motion.button
            onClick={() => {
              window.location.href =
                "/student/lessons";
            }}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0b0a10]/75 p-6 text-left backdrop-blur-2xl"
          >
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-500/[0.06] blur-[60px]" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/10 bg-cyan-400/[0.06]">
                    <BookOpen
                      size={17}
                      className="text-cyan-200/70"
                    />
                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-white/20 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-200"
                  />
                </div>

                <h3 className="mt-6 text-xl font-medium">
                  Teacher lessons
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Open lessons published for {displayClass}.
                </p>
              </div>

              <div className="mt-7 flex items-center gap-2 text-[10px] text-cyan-200/60">
                <Check size={12} />
                View available lessons
              </div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => {
              window.location.href =
                "/student/tutor";
            }}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-[28px] border border-violet-300/[0.12] bg-gradient-to-br from-violet-500/[0.12] to-[#0b0a10]/80 p-6 text-left backdrop-blur-2xl"
          >
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-violet-500/[0.13] blur-[70px]" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-500/10">
                    <BrainCircuit
                      size={18}
                      className="text-violet-300"
                    />
                  </div>

                  <ArrowUpRight
                    size={17}
                    className="text-white/25 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-300"
                  />
                </div>

                <h3 className="mt-6 text-xl font-medium">
                  AI Tutor
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Ask questions in {displayLanguage} and
                  learn at {displayClass} level.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-[10px] text-violet-200/60">
                <Sparkles size={12} />
                Available now
              </div>
            </div>
          </motion.button>
        </div>

        {/* VOICE + STATS */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0b0a10]/75 p-6 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-white/25">
                  <Mic size={12} />
                  Voice learning
                </div>

                <h3 className="mt-4 text-lg font-medium">
                  Listen & understand
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <Volume2
                  size={16}
                  className="text-violet-300"
                />
              </div>
            </div>

            <div className="mt-8 flex h-12 items-center gap-[4px]">
              {waveform.map((height, index) => (
                <motion.div
                  key={index}
                  animate={{
                    height: [
                      `${height * 0.4}%`,
                      `${height}%`,
                      `${height * 0.5}%`,
                    ],
                  }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    delay: index * 0.07,
                    ease: "easeInOut",
                  }}
                  className="flex-1 rounded-full bg-violet-300/35"
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-[10px] text-white/25">
                {displayLanguage} explanation
              </span>

              <button
                onClick={() => {
                  window.location.href =
                    "/student/tutor";
                }}
                className="flex items-center gap-1.5 text-[10px] text-violet-300/70"
              >
                Play
                <Play size={10} fill="currentColor" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0b0a10]/75 p-6 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-white/25">
                <Flame size={12} />
                Weekly streak
              </div>

              <span className="text-xs text-orange-300/70">
                7 / 7
              </span>
            </div>

            <div className="mt-7 flex items-end gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map(
                (day) => (
                  <div key={day} className="flex-1">
                    <div className="mx-auto flex h-9 w-full items-center justify-center rounded-xl border border-orange-300/10 bg-orange-400/[0.09]">
                      <Check
                        size={12}
                        className="text-orange-300/80"
                      />
                    </div>

                    <div className="mt-2 text-center text-[8px] text-white/20">
                      {day}
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 flex items-center gap-2 text-[10px] text-white/30">
              <Star
                size={12}
                className="text-orange-300/70"
              />
              Keep your learning momentum going.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="relative overflow-hidden rounded-[28px] border border-violet-300/[0.09] bg-gradient-to-br from-violet-500/[0.07] to-[#0b0a10]/80 p-6 backdrop-blur-2xl"
          >
            <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-violet-500/[0.10] blur-[70px]" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-white/25">
                <Sparkles size={12} />
                AI learning insight
              </div>

              <p className="mt-6 text-sm leading-6 text-white/55">
                Your current learning profile is{" "}
                <span className="text-violet-200/80">
                  {displayClass}
                </span>{" "}
                with{" "}
                <span className="text-violet-200/80">
                  {displayLanguage}
                </span>{" "}
                as your preferred language.
              </p>

              <div className="mt-6 flex items-center gap-2 text-[10px] text-violet-300/60">
                <BrainCircuit size={12} />
                Profile synced with VernacAI
              </div>
            </div>
          </motion.div>
        </div>

        {/* SUBJECTS */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-12"
        >
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                Your subjects
              </div>

              <h2 className="mt-3 text-2xl font-medium tracking-tight">
                Keep exploring
                <span className="text-violet-400">.</span>
              </h2>
            </div>

            <button
              onClick={() => {
                window.location.href =
                  "/student/lessons";
              }}
              className="hidden items-center gap-1 text-xs text-white/35 transition hover:text-white sm:flex"
            >
              View lessons
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                name: "Science",
                topic: "Explore concepts",
                progress: 72,
              },
              {
                name: "Mathematics",
                topic: "Practice problems",
                progress: 48,
              },
              {
                name: "English",
                topic: "Build vocabulary",
                progress: 31,
              },
            ].map((subject) => (
              <motion.button
                key={subject.name}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  window.location.href =
                    "/student/lessons";
                }}
                className="group relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#0b0a10]/70 p-5 text-left backdrop-blur-xl"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-violet-500/[0.06] blur-[50px]" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-sm text-violet-300">
                      {subjectIcons[subject.name] ||
                        "•"}
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="text-white/20 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-300"
                    />
                  </div>

                  <h3 className="mt-7 text-lg font-medium">
                    {subject.name}
                  </h3>

                  <p className="mt-1 text-xs text-white/30">
                    {subject.topic}
                  </p>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-[9px]">
                      <span className="text-white/20">
                        Progress
                      </span>
                      <span className="text-white/35">
                        {subject.progress}%
                      </span>
                    </div>

                    <div className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        style={{
                          width: `${subject.progress}%`,
                        }}
                        className="h-full rounded-full bg-violet-400/60"
                      />
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* RECENT ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-12 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]"
        >
          <div className="rounded-[28px] border border-white/[0.07] bg-[#0b0a10]/70 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                  Recent activity
                </div>

                <h2 className="mt-3 text-xl font-medium">
                  Your learning
                </h2>
              </div>

              <button
                onClick={() => {
                  window.location.href =
                    "/student/history";
                }}
                className="flex items-center gap-1 text-[10px] text-white/30 transition hover:text-white"
              >
                History
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="mt-6 divide-y divide-white/[0.05]">
              {loading ? (
                <div className="flex items-center gap-2 py-5 text-xs text-white/30">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading activity...
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="py-6">
                  <p className="text-xs text-white/30">
                    Your learning sessions will appear here.
                  </p>

                  <button
                    onClick={() => {
                      window.location.href =
                        "/student/tutor";
                    }}
                    className="mt-4 text-xs text-violet-300/70 hover:text-violet-200"
                  >
                    Start your first session →
                  </button>
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.035]">
                        <GraduationCap
                          size={14}
                          className="text-white/35"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-xs text-white/70">
                          {activity.question}
                        </div>

                        <div className="mt-1 text-[9px] text-white/20">
                          {activity.subject ||
                            "General"}{" "}
                          ·{" "}
                          {activity.learning_mode ||
                            "Explain"}{" "}
                          ·{" "}
                          {formatDate(
                            activity.created_at,
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      size={13}
                      className="shrink-0 text-white/15"
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href =
                "/student/tutor";
            }}
            className="group relative overflow-hidden rounded-[28px] border border-violet-300/[0.1] bg-gradient-to-br from-violet-500/[0.10] via-[#0b0a10]/80 to-[#0b0a10] p-6 text-left"
          >
            <div className="absolute -bottom-16 -right-16 h-52 w-52 rounded-full bg-violet-500/[0.12] blur-[70px]" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/10 bg-violet-500/10">
                  <Mic
                    size={18}
                    className="text-violet-300"
                  />
                </div>

                <h3 className="mt-7 text-xl font-medium">
                  Ask in your language.
                </h3>

                <p className="mt-3 text-xs leading-6 text-white/35">
                  Speak or type a question. VernacAI will
                  explain it for {displayClass} in{" "}
                  {displayLanguage}.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs text-violet-200/70">
                Open AI Tutor
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </button>
        </motion.div>
      </section>
    </main>
  );
}

export default StudentDashboard;
