import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  LogOut,
  Sparkles,
} from "lucide-react";

import { supabase } from "../lib/supabase";

type NavbarProps = {
  currentPage?: "home" | "student" | "tutor" | "teacher";
};

function Navbar({ currentPage = "home" }: NavbarProps) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        setUserName(profile.full_name);
      }
    };

    loadUser();
  }, []);

  const goToStudent = () => {
    window.location.href = "/student";
  };

  const goToTeacher = () => {
    window.location.href = "/teacher";
  };

  const goToTechnology = () => {
    if (currentPage === "home") {
      document.getElementById("technology")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.location.href = "/#technology";
    }
  };

  const goHome = () => {
    if (currentPage === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.location.href = "/";
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="relative z-50 mx-auto mt-5 w-[calc(100%-28px)] max-w-[1280px] md:mt-7 md:w-[calc(100%-56px)]"
    >
      <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-violet-400/10 via-white/[0.05] to-cyan-400/[0.08] blur-[2px]" />

      <div className="relative flex min-h-[62px] items-center justify-between overflow-hidden rounded-full border border-white/[0.12] bg-[#0a0a0f]/75 px-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:min-h-[68px] md:px-6">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_25px_rgba(139,92,246,0.045)]" />

        <motion.div
          animate={{
            x: ["-130%", "180%"],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "linear",
          }}
          className="pointer-events-none absolute inset-y-0 w-[25%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
        />

        {/* Brand */}
        <button
          onClick={goHome}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-400/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_20px_rgba(139,92,246,0.08)]">
            <Sparkles className="relative z-10 h-4 w-4 text-violet-200" />

            <motion.div
              animate={{
                opacity: [0.15, 0.55, 0.15],
                scale: [0.85, 1.12, 0.85],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-xl bg-violet-400/20 blur-md"
            />
          </div>

          <div className="text-left">
            <div className="text-sm font-semibold tracking-tight text-white">
              VernacAI
            </div>

            <div className="mt-0.5 text-[8px] uppercase tracking-[0.22em] text-white/35">
              Vernacular intelligence
            </div>
          </div>
        </button>

        {/* Desktop navigation */}
        <div className="relative z-10 hidden items-center gap-8 md:flex">
          <button
            onClick={goToStudent}
            className="text-xs font-medium text-white/60 transition hover:text-white"
          >
            Students
          </button>

          <button
            onClick={goToTeacher}
            className="text-xs font-medium text-white/60 transition hover:text-white"
          >
            Teachers
          </button>

          <button
            onClick={goToTechnology}
            className="text-xs font-medium text-white/60 transition hover:text-white"
          >
            Technology
          </button>
        </div>

        {/* Right side */}
        <div className="relative z-10 flex items-center gap-2">
          {userName && (
            <div className="hidden rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[10px] text-white/45 lg:block">
              {userName}
            </div>
          )}

          <button
            onClick={logout}
            className="group flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-2.5 text-xs text-white/55 transition hover:border-red-300/20 hover:bg-red-400/[0.06] hover:text-white"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">
              Sign out
            </span>
          </button>

          <button
            onClick={goToStudent}
            className="group hidden items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-4 py-2.5 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition hover:border-violet-300/30 hover:bg-violet-400/[0.14] sm:flex"
          >
            Launch

            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;