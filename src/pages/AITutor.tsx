import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  Brain,
  Check,
  ChevronDown,
  Lightbulb,
  Loader2,
  Mic,
  MicOff,
  Send,
  Settings2,
  Sparkles,
  Volume2,
  VolumeX,
  WandSparkles,
  HelpCircle,
  Languages,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { getMyProfile } from "../lib/profile";
import { saveLearningSession } from "../lib/sessions";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const languageCodes: Record<string, string> = {
  Telugu: "te-IN",
  Hindi: "hi-IN",
  Tamil: "ta-IN",
  Kannada: "kn-IN",
  Malayalam: "ml-IN",
  English: "en-IN",
};

const learningModes = [
  {
    name: "Explain",
    description: "Understand the concept",
    icon: Brain,
  },
  {
    name: "Example",
    description: "Learn with an example",
    icon: Lightbulb,
  },
  {
    name: "Quiz Me",
    description: "Test your understanding",
    icon: HelpCircle,
  },
  {
    name: "Simplify",
    description: "Make it easier",
    icon: WandSparkles,
  },
  {
    name: "Translate",
    description: "Learn in your language",
    icon: Languages,
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    text: "Hello! I'm your VernacAI tutor. Ask me anything about your lesson, and I'll explain it at your level.",
  },
];

function AITutor() {
  const [messages, setMessages] =
    useState<Message[]>(initialMessages);

  const [question, setQuestion] = useState("");

  const [classLevel, setClassLevel] =
    useState("Class 5");

  const [subject, setSubject] =
    useState("Science");

  const [language, setLanguage] =
    useState("Telugu");

  const [learningMode, setLearningMode] =
    useState("Explain");

  const [lessonContext, setLessonContext] = useState(
    sessionStorage.getItem("vernacai_lesson_context") || "",
  );

  const [lessonTopic, setLessonTopic] = useState(
    sessionStorage.getItem("vernacai_lesson_topic") || "",
  );

  const [profileLoading, setProfileLoading] =
    useState(true);

  const [isThinking, setIsThinking] =
    useState(false);

  const [isListening, setIsListening] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [error, setError] =
    useState("");

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const mediaStreamRef =
    useRef<MediaStream | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  const messageEndRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedContext = sessionStorage.getItem(
      "vernacai_lesson_context",
    );
    const storedTopic = sessionStorage.getItem(
      "vernacai_lesson_topic",
    );

    if (storedContext) {
      setLessonContext(storedContext);
    }

    if (storedTopic) {
      setLessonTopic(storedTopic);
    }
  }, []);

  useEffect(() => {
    const loadStudentProfile = async () => {
      try {
        const profile = await getMyProfile();

        if (profile.role !== "student") {
          return;
        }

        if (profile.class_level?.trim()) {
          setClassLevel(profile.class_level);
        }

        if (profile.preferred_language?.trim()) {
          setLanguage(profile.preferred_language);
        }
      } catch (profileError) {
        console.error(
          "Failed to load student profile:",
          profileError,
        );
      } finally {
        setProfileLoading(false);
      }
    };

    loadStudentProfile();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  // --------------------------------------------------
  // ASK AI TUTOR
  // --------------------------------------------------

  const askTutor = async (
    event?: FormEvent,
  ) => {
    event?.preventDefault();

    const trimmedQuestion =
      question.trim();

    if (
      !trimmedQuestion ||
      isThinking
    ) {
      return;
    }

    setError("");

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: trimmedQuestion,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setQuestion("");
    setIsThinking(true);

    try {
      const response = await fetch(
        `${API_URL}/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: trimmedQuestion,
            class_level: classLevel,
            subject,
            language,
            learning_mode: learningMode,
            lesson_context: lessonContext || undefined,
            lesson_topic: lessonTopic || undefined,
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            "AI Tutor request failed.",
        );
      }

      const answer =
        result?.data?.answer ||
        "I couldn't generate an answer right now.";

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        text: answer,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);

      try {
        await saveLearningSession({
          question: trimmedQuestion,
          answer,
          classLevel,
          subject,
          language,
          learningMode,
        });
      } catch (saveError) {
        console.error(
          "Failed to save learning session:",
          saveError,
        );
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong.";

      setError(message);
    } finally {
      setIsThinking(false);
    }
  };

  // --------------------------------------------------
  // TEXT TO SPEECH
  // --------------------------------------------------

  const listenToMessage = async (
    text: string,
  ) => {
    if (isSpeaking) {
      return;
    }

    try {
      setError("");
      setIsSpeaking(true);

      const response = await fetch(
        `${API_URL}/voice/text-to-speech`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            language:
              languageCodes[language] ||
              "en-IN",
          }),
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            "Text-to-speech failed.",
        );
      }

      const audioBase64 =
        result?.data?.audio_base64;

      if (!audioBase64) {
        throw new Error(
          "No audio was returned by Sarvam.",
        );
      }

      const audio = new Audio(
        `data:audio/wav;base64,${audioBase64}`,
      );

      audio.onended = () => {
        setIsSpeaking(false);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        setError(
          "Unable to play the generated audio.",
        );
      };

      await audio.play();
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Text-to-speech failed.";

      setError(message);
      setIsSpeaking(false);
    }
  };

  // --------------------------------------------------
  // SEND AUDIO TO SARVAM
  // --------------------------------------------------

  const sendAudioToSarvam = async (
    audioBlob: Blob,
  ) => {
    try {
      setError("");

      const formData =
        new FormData();

      const extension =
        audioBlob.type.includes("webm")
          ? "webm"
          : "wav";

      formData.append(
        "file",
        audioBlob,
        `vernacai-recording.${extension}`,
      );

      formData.append(
        "language",
        languageCodes[language] ||
          "en-IN",
      );

      const response = await fetch(
        `${API_URL}/voice/speech-to-text`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.detail ||
            "Speech-to-text failed.",
        );
      }

      const transcript =
        result?.data?.text?.trim() ||
        "";

      if (!transcript) {
        throw new Error(
          "Sarvam couldn't detect any speech. Please try again.",
        );
      }

      setQuestion(transcript);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Speech-to-text failed.";

      setError(message);
    }
  };

  // --------------------------------------------------
  // START RECORDING
  // --------------------------------------------------

  const startRecording =
    async () => {
      try {
        setError("");

        if (
          !navigator.mediaDevices?.getUserMedia
        ) {
          throw new Error(
            "Your browser does not support microphone recording.",
          );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
            },
          );

        mediaStreamRef.current =
          stream;

        let mimeType = "";

        if (
          MediaRecorder.isTypeSupported(
            "audio/webm;codecs=opus",
          )
        ) {
          mimeType =
            "audio/webm;codecs=opus";
        } else if (
          MediaRecorder.isTypeSupported(
            "audio/webm",
          )
        ) {
          mimeType =
            "audio/webm";
        }

        const recorder =
          mimeType
            ? new MediaRecorder(
                stream,
                { mimeType },
              )
            : new MediaRecorder(
                stream,
              );

        mediaRecorderRef.current =
          recorder;

        audioChunksRef.current =
          [];

        recorder.ondataavailable =
          (event) => {
            if (
              event.data.size > 0
            ) {
              audioChunksRef.current.push(
                event.data,
              );
            }
          };

        recorder.onstop =
          async () => {
            const actualMimeType =
              recorder.mimeType ||
              "audio/webm";

            const audioBlob =
              new Blob(
                audioChunksRef.current,
                {
                  type: actualMimeType,
                },
              );

            audioChunksRef.current =
              [];

            stream
              .getTracks()
              .forEach((track) =>
                track.stop(),
              );

            mediaStreamRef.current =
              null;

            if (
              audioBlob.size === 0
            ) {
              setError(
                "No audio was recorded.",
              );
              return;
            }

            await sendAudioToSarvam(
              audioBlob,
            );
          };

        recorder.start();

        setIsListening(true);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Microphone access failed.";

        setError(message);
        setIsListening(false);
      }
    };

  // --------------------------------------------------
  // STOP RECORDING
  // --------------------------------------------------

  const stopRecording = () => {
    if (
      mediaRecorderRef.current
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsListening(false);
  };

  // --------------------------------------------------
  // MICROPHONE
  // --------------------------------------------------

  const toggleMicrophone = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current
      ) {
        mediaRecorderRef.current.stop();
      }

      if (
        mediaStreamRef.current
      ) {
        mediaStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop(),
          );
      }
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050507] text-white">
      <Navbar currentPage="tutor" />

      <main className="mx-auto w-[calc(100%-28px)] max-w-[1280px] pb-12 pt-8 md:w-[calc(100%-56px)] md:pb-16 md:pt-12">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <button
              onClick={() => {
                window.location.href =
                  "/student";
              }}
              className="mb-5 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to dashboard
            </button>

            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08]">
                <Brain className="h-4 w-4 text-violet-200" />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-200/70">
                AI Tutor
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-6xl">
              Learn at your level.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40 md:text-base">
              Ask questions in your language.
              VernacAI adapts the explanation
              to your class, subject and learning
              mode.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-300/10 bg-emerald-400/[0.05] px-3 py-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-200/70">
              Tutor online
            </span>
          </div>
        </div>

        {/* LEARNING PROFILE */}

        <section className="mb-5 rounded-[28px] border border-white/[0.08] bg-[#0a0a0f]/80 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-5">

          <div className="mb-4 flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-violet-200/70" />

            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Learning profile
            </span>

            <span className="ml-auto text-[9px] uppercase tracking-[0.14em] text-white/20">
              {profileLoading ? "Syncing profile..." : "Synced from Supabase"}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">

            {/* CLASS */}

            <label className="relative block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-white/30">
                Class
              </span>

              <div className="relative">
                <select
                  value={classLevel}
                  onChange={(event) =>
                    setClassLevel(
                      event.target.value,
                    )
                  }
                  className="w-full appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300/30"
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

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              </div>
            </label>

            {/* SUBJECT */}

            <label className="relative block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-white/30">
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
                  className="w-full appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300/30"
                >
                  {[
                    "Science",
                    "Mathematics",
                    "English",
                    "Social Studies",
                    "EVS",
                  ].map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-[#0a0a0f]"
                    >
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              </div>
            </label>

            {/* LANGUAGE */}

            <label className="relative block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-white/30">
                Learning language
              </span>

              <div className="relative">
                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(
                      event.target.value,
                    )
                  }
                  className="w-full appearance-none rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-300/30"
                >
                  {[
                    "Telugu",
                    "English",
                    "Hindi",
                    "Tamil",
                    "Kannada",
                    "Malayalam",
                  ].map((item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-[#0a0a0f]"
                    >
                      {item}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              </div>
            </label>

          </div>
        </section>

        {/* LEARNING MODES */}

        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/60">
                Learning mode
              </p>

              <p className="mt-1 text-xs text-white/25">
                Choose how VernacAI should teach you.
              </p>
            </div>

            <div className="hidden text-[9px] uppercase tracking-[0.14em] text-white/20 md:block">
              Active · {learningMode}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-5">

            {learningModes.map((mode) => {
              const Icon = mode.icon;

              const active =
                learningMode === mode.name;

              return (
                <button
                  key={mode.name}
                  type="button"
                  onClick={() =>
                    setLearningMode(
                      mode.name,
                    )
                  }
                  className={`group rounded-2xl border p-3 text-left transition ${
                    active
                      ? "border-violet-300/25 bg-violet-400/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.13] hover:bg-white/[0.035]"
                  }`}
                >
                  <div
                    className={`mb-3 flex h-8 w-8 items-center justify-center rounded-xl ${
                      active
                        ? "bg-violet-400/[0.14] text-violet-200"
                        : "bg-white/[0.04] text-white/30 group-hover:text-white/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <p
                    className={`text-xs font-medium ${
                      active
                        ? "text-white"
                        : "text-white/55"
                    }`}
                  >
                    {mode.name}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-white/25">
                    {mode.description}
                  </p>
                </button>
              );
            })}

          </div>
        </section>

        {/* CHAT */}

        <section className="overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0a0a0f]/80 shadow-[0_30px_100px_rgba(0,0,0,0.3)] backdrop-blur-xl">

          {/* TOP BAR */}

          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 md:px-6">
            <div className="flex items-center gap-3">

              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08]">
                <Sparkles className="h-4 w-4 text-violet-200" />

                <div className="absolute inset-0 rounded-xl bg-violet-400/10 blur-md" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  VernacAI Tutor
                </p>

                <p className="text-[10px] uppercase tracking-[0.14em] text-white/25">
                  Gemini · Pedagogy · Sarvam
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <div className="rounded-full border border-violet-300/10 bg-violet-400/[0.05] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-violet-200/60">
                {classLevel}
              </div>

              <div className="rounded-full border border-cyan-300/10 bg-cyan-400/[0.04] px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-cyan-200/50">
                {learningMode}
              </div>
            </div>
          </div>

          {/* MESSAGES */}

          <div className="min-h-[430px] max-h-[600px] space-y-5 overflow-y-auto p-4 md:p-6">

            {messages.map(
              (message) => {
                const isUser =
                  message.role ===
                  "user";

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] md:max-w-[75%] ${
                        isUser
                          ? "rounded-[24px] rounded-br-md border border-violet-300/10 bg-violet-400/[0.10]"
                          : "rounded-[24px] rounded-bl-md border border-white/[0.07] bg-white/[0.025]"
                      } p-4`}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                          {isUser
                            ? "You"
                            : "VernacAI"}
                        </span>

                        {!isUser && (
                          <Check className="h-3 w-3 text-emerald-300/50" />
                        )}
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-7 text-white/75">
                        {message.text}
                      </p>

                      {!isUser && (
                        <button
                          onClick={() =>
                            listenToMessage(
                              message.text,
                            )
                          }
                          disabled={
                            isSpeaking
                          }
                          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/45 transition hover:border-violet-300/20 hover:bg-violet-400/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="h-3.5 w-3.5" />
                              Playing
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3.5 w-3.5" />
                              Listen
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              },
            )}

            {isThinking && (
              <div className="flex justify-start">
                <div className="rounded-[24px] rounded-bl-md border border-white/[0.07] bg-white/[0.025] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-4 w-4 animate-spin text-violet-300/70" />

                    <span className="text-xs text-white/40">
                      VernacAI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* ERROR */}

          {error && (
            <div className="mx-4 mb-4 rounded-2xl border border-red-300/10 bg-red-400/[0.05] px-4 py-3 md:mx-6">
              <p className="text-xs leading-5 text-red-200/70">
                {error}
              </p>
            </div>
          )}

          {/* RECORDING */}

          {isListening && (
            <div className="mx-4 mb-3 flex items-center gap-3 rounded-2xl border border-red-300/10 bg-red-400/[0.05] px-4 py-3 md:mx-6">

              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-red-400/10">
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-red-300/40" />

                <span className="relative h-2 w-2 rounded-full bg-red-300" />
              </div>

              <div>
                <p className="text-xs font-medium text-red-100/80">
                  Listening...
                </p>

                <p className="text-[10px] text-white/30">
                  Speak your question, then press
                  the microphone again.
                </p>
              </div>
            </div>
          )}

          {/* INPUT */}

          <form
            onSubmit={askTutor}
            className="border-t border-white/[0.07] p-4 md:p-5"
          >
            <div className="relative rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-2 transition focus-within:border-violet-300/20">

              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                      "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    askTutor();
                  }
                }}
                placeholder={
                  isListening
                    ? "Listening to your question..."
                    : `Ask VernacAI in ${language}...`
                }
                disabled={
                  isListening ||
                  isThinking
                }
                rows={2}
                className="w-full resize-none bg-transparent px-3 py-2 pr-28 text-sm leading-6 text-white outline-none placeholder:text-white/20 disabled:cursor-not-allowed"
              />

              <div className="absolute bottom-3 right-3 flex items-center gap-2">

                {/* MICROPHONE */}

                <button
                  type="button"
                  onClick={
                    toggleMicrophone
                  }
                  disabled={
                    isThinking
                  }
                  aria-label={
                    isListening
                      ? "Stop recording"
                      : "Start recording"
                  }
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    isListening
                      ? "border-red-300/30 bg-red-400/[0.12] text-red-200 shadow-[0_0_25px_rgba(248,113,113,0.12)]"
                      : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:border-violet-300/20 hover:bg-violet-400/[0.08] hover:text-white"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>

                {/* SEND */}

                <button
                  type="submit"
                  disabled={
                    !question.trim() ||
                    isThinking ||
                    isListening
                  }
                  aria-label="Ask VernacAI"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-300/20 bg-violet-400/[0.12] text-violet-100 transition hover:bg-violet-400/[0.18] disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {isThinking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>

              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 px-1 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-2">
                <WandSparkles className="h-3 w-3 text-violet-300/40" />

                <p className="text-[9px] uppercase tracking-[0.14em] text-white/20">
                  {learningMode} mode ·{" "}
                  {classLevel}
                </p>
              </div>

              <p className="text-[9px] uppercase tracking-[0.12em] text-white/15">
                Enter to ask · Shift + Enter
                for new line
              </p>

            </div>
          </form>
        </section>

        {/* SYSTEM STATUS */}

        <div className="mt-5 grid gap-3 md:grid-cols-3">

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Brain className="h-3.5 w-3.5 text-violet-300/60" />

              <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                Intelligence
              </span>
            </div>

            <p className="text-xs text-white/50">
              Gemini AI
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
            <div className="mb-2 flex items-center gap-2">
              <WandSparkles className="h-3.5 w-3.5 text-cyan-300/50" />

              <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                Adaptation
              </span>
            </div>

            <p className="text-xs text-white/50">
              Class-aware + mode-aware
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-4">
            <div className="mb-2 flex items-center gap-2">
              <Mic className="h-3.5 w-3.5 text-emerald-300/50" />

              <span className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                Voice
              </span>
            </div>

            <p className="text-xs text-white/50">
              Sarvam STT + TTS
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default AITutor;