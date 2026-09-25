import { supabase } from "./supabase";

export type SaveLearningSessionInput = {
  question: string;
  answer: string;
  classLevel: string;
  subject: string;
  language: string;
  learningMode: string;
};

export async function saveLearningSession(
  session: SaveLearningSessionInput,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be logged in to save a learning session.");
  }

  const { data, error } = await supabase
    .from("learning_sessions")
    .insert({
      student_id: user.id,
      question: session.question,
      answer: session.answer,
      class_level: session.classLevel,
      subject: session.subject,
      language: session.language,
      learning_mode: session.learningMode,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getStudentSessions() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const { data, error } = await supabase
    .from("learning_sessions")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function deleteLearningSession(
  sessionId: string,
) {
  const { error } = await supabase
    .from("learning_sessions")
    .delete()
    .eq("id", sessionId);

  if (error) {
    throw new Error(error.message);
  }
}