import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import AITutor from "./pages/AITutor";
import TeacherWorkspace from "./pages/TeacherWorkspace";
import TeacherLessons from "./pages/TeacherLessons";
import StudentLessons from "./pages/StudentLessons";
import LearningHistory from "./pages/LearningHistory";
import Auth from "./pages/Auth";

type UserRole = "student" | "teacher";

function App() {
  const [loading, setLoading] = useState(true);
  const [sessionExists, setSessionExists] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  const path = window.location.pathname;

  useEffect(() => {
    const loadUserRole = async (
      userId: string,
    ) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (
        profile?.role === "teacher" ||
        profile?.role === "student"
      ) {
        setRole(profile.role);
      } else {
        setRole("student");
      }
    };

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSessionExists(false);
        setRole(null);
        setLoading(false);
        return;
      }

      setSessionExists(true);
      await loadUserRole(session.user.id);
      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setSessionExists(false);
          setRole(null);
          setLoading(false);
          return;
        }

        setSessionExists(true);
        await loadUserRole(session.user.id);
        setLoading(false);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-300" />
          <p className="text-xs text-white/35">
            Loading VernacAI...
          </p>
        </div>
      </div>
    );
  }

  if (path === "/auth") {
    return <Auth />;
  }

  if (path === "/") {
    return <Home />;
  }

  if (!sessionExists) {
    window.location.href = "/auth";
    return null;
  }

  if (path === "/student/lessons") {
    if (role !== "student") {
      window.location.href = "/teacher";
      return null;
    }

    return <StudentLessons />;
  }

  if (path === "/student/history") {
    if (role !== "student") {
      window.location.href = "/teacher";
      return null;
    }

    return <LearningHistory />;
  }

  if (
    path === "/student" ||
    path === "/student/tutor"
  ) {
    if (role !== "student") {
      window.location.href = "/teacher";
      return null;
    }

    if (path === "/student/tutor") {
      return <AITutor />;
    }

    return <StudentDashboard />;
  }

  if (path === "/teacher/lessons") {
    if (role !== "teacher") {
      window.location.href = "/student";
      return null;
    }

    return <TeacherLessons />;
  }

  if (path === "/teacher") {
    if (role !== "teacher") {
      window.location.href = "/student";
      return null;
    }

    return <TeacherWorkspace />;
  }

  window.location.href =
    role === "teacher" ? "/teacher" : "/student";

  return null;
}

export default App;
