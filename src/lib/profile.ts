import { supabase } from "./supabase";

export type StudentProfile = {
  id: string;
  full_name: string | null;
  role: "student" | "teacher";
  class_level: string;
  preferred_language: string;
  created_at: string;
  updated_at: string;
};

export async function getMyProfile(): Promise<StudentProfile> {
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
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as StudentProfile;
}

export async function updateMyStudentProfile(
  classLevel: string,
  preferredLanguage: string,
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
    .from("profiles")
    .update({
      class_level: classLevel,
      preferred_language: preferredLanguage,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as StudentProfile;
}
