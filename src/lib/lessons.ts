import { supabase } from "./supabase";

export type SaveLessonInput = {
  topic: string;
  subject: string;
  classLevel: string;
  sourceLanguage: string;
  targetLanguage: string;
  originalContent: string;
  translatedContent?: string;
};

export async function saveLesson(
  lesson: SaveLessonInput,
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("You must be logged in to save a lesson.");
  }

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      teacher_id: user.id,
      topic: lesson.topic,
      subject: lesson.subject,
      class_level: lesson.classLevel,
      source_language: lesson.sourceLanguage,
      target_language: lesson.targetLanguage,
      original_content: lesson.originalContent,
      translated_content: lesson.translatedContent ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getTeacherLessons() {
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
    .from("lessons")
    .select("*")
    .eq("teacher_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function publishLesson(
  lessonId: string,
  published: boolean,
) {
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
    .from("lessons")
    .update({
      is_published: published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", lessonId)
    .eq("teacher_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAvailableLessons() {
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

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("class_level")
      .eq("id", user.id)
      .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("is_published", true)
    .eq("class_level", profile?.class_level ?? "Class 5")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function deleteLesson(
  lessonId: string,
) {
  const { error } = await supabase
    .from("lessons")
    .delete()
    .eq("id", lessonId);

  if (error) {
    throw new Error(error.message);
  }
}
