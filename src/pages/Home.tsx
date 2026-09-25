import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Check,
  ChevronRight,
  Languages,
  Sparkles,
  Volume2,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
const languages = ["తెలుగు", "हिन्दी", "தமிழ்", "ಕನ್ನಡ"];

function Home() {
  const [activeLanguage, setActiveLanguage] = useState("తెలుగు");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 90,
    damping: 22,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 90,
    damping: 22,
  });

  const rotateX = useTransform(smoothY, [-500, 500], [4, -4]);
  const rotateY = useTransform(smoothX, [-500, 500], [-5, 5]);

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % languages.length;
      setActiveLanguage(languages[index]);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const goToStudent = () => {
    window.location.href = "/student";
  };

  const goToTeacher = () => {
    window.location.href = "/teacher";
  };

  const scrollToTechnology = () => {
    document.getElementById("technology")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCardMouseMove = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    mouseX.set(
      event.clientX - (rect.left + rect.width / 2),
    );

    mouseY.set(
      event.clientY - (rect.top + rect.height / 2),
    );
  };

  const resetCardTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050507] text-white">
      {/* =====================================================
          CINEMATIC BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Main purple atmosphere */}

        <motion.div
          animate={{
            x: [0, 70, -40, 0],
            y: [0, -45, 35, 0],
            scale: [1, 1.15, 0.95, 1],
            opacity: [0.65, 0.9, 0.6, 0.65],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[-10%] top-[-15%] h-[650px] w-[650px] rounded-full bg-violet-600/[0.16] blur-[150px]"
        />

        {/* Secondary purple glow */}

        <motion.div
          animate={{
            x: [0, -70, 30, 0],
            y: [0, 40, -25, 0],
            scale: [1, 0.9, 1.1, 1],
            opacity: [0.35, 0.55, 0.3, 0.35],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-8%] top-[12%] h-[520px] w-[520px] rounded-full bg-purple-500/[0.12] blur-[140px]"
        />

        {/* Cyan atmospheric light */}

        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 30, -20, 0],
            opacity: [0.15, 0.3, 0.12, 0.15],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[10%] top-[45%] h-[420px] w-[420px] rounded-full bg-cyan-500/[0.08] blur-[150px]"
        />

        {/* Lower purple light */}

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-15%] left-[30%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.08] blur-[150px]"
        />

        {/* Grid */}

        <motion.div
          animate={{
            backgroundPosition: ["0px 0px", "72px 72px"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(167,139,250,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.8) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        {/* Vignette */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(5,5,7,0.15)_42%,#050507_90%)]" />

        {/* Top fade */}

        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050507] to-transparent" />
      </div>

      {/* =====================================================
          FLOATING NAVBAR
      ====================================================== */}
<Navbar currentPage="home" />
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative z-10 mx-auto w-[calc(100%-28px)] max-w-[1280px] pb-24 pt-16 md:w-[calc(100%-56px)] md:pb-32 md:pt-24">
        {/* Floating language glyph */}

        <motion.div
          animate={{
            y: [0, -18, 0],
            rotate: [0, 4, 0],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute left-[2%] top-[18%] hidden text-6xl font-light text-violet-200/[0.08] md:block"
        >
          అ
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -4, 0],
            opacity: [0.2, 0.45, 0.2],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute right-[3%] top-[17%] hidden text-7xl font-light text-cyan-200/[0.07] md:block"
        >
          अ
        </motion.div>

        <motion.div
          animate={{
            y: [0, -12, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute bottom-[10%] left-[42%] hidden text-5xl font-light text-violet-200/[0.06] md:block"
        >
          தமிழ்
        </motion.div>

        <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
          {/* =================================================
              HERO LEFT
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
            }}
          >
            {/* Eyebrow */}

            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-violet-300/50" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-violet-200/65">
                AI · EDUCATION · LANGUAGE
              </span>
            </div>

            {/* Heading */}

            <h1 className="max-w-[760px] text-[26px] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-[36px] md:text-7xl lg:text-[6.8rem]">
              <span className="text-white">
  Knowledge
</span>

<span className="block text-white/38">
  has no
</span>

<span className="block bg-gradient-to-r from-violet-100 via-violet-300 to-purple-500 bg-clip-text text-transparent">
  language.
</span>
            </h1>

            <p className="mt-8 max-w-xl text-sm leading-7 text-white/55 md:text-base">
              VernacAI transforms educational content into
              class-appropriate learning experiences in the learner&apos;s
              mother tongue through adaptive AI, text and voice.
            </p>

            {/* CTA */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={goToStudent}
                className="group flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black shadow-[0_10px_40px_rgba(255,255,255,0.08)] transition duration-300 hover:bg-violet-100 hover:shadow-[0_10px_45px_rgba(167,139,250,0.18)]"
              >
                Start learning

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <button
                onClick={scrollToTechnology}
                className="group flex items-center justify-center gap-2 rounded-full border border-white/[0.11] bg-white/[0.035] px-6 py-3.5 text-xs font-medium text-white/65 backdrop-blur-xl transition duration-300 hover:border-violet-300/25 hover:bg-violet-400/[0.07] hover:text-white"
              >
                Explore the technology

                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </div>

            {/* Languages */}

            <div className="mt-12 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[8px] uppercase tracking-[0.2em] text-white/20">
                Supports
              </span>

              {["English", "తెలుగు", "हिन्दी", "தமிழ்", "ಕನ್ನಡ"].map(
                (language, index) => (
                  <motion.button
                    key={language}
                    whileHover={{
                      y: -2,
                    }}
                    onClick={() => {
                      if (language !== "English") {
                        setActiveLanguage(language);
                      }
                    }}
                    className={`rounded-full border px-3 py-1.5 text-[9px] transition ${
                      activeLanguage === language
                        ? "border-violet-300/25 bg-violet-400/[0.1] text-violet-100"
                        : "border-white/[0.07] bg-white/[0.025] text-white/35 hover:border-white/15 hover:text-white/65"
                    }`}
                  >
                    {language}

                    {index < 4 && (
                      <span className="ml-2 text-white/15">
                        →
                      </span>
                    )}
                  </motion.button>
                ),
              )}
            </div>
          </motion.div>

          {/* =================================================
              HERO PRODUCT
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.3,
            }}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={resetCardTilt}
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1200,
            }}
            className="relative"
          >
            {/* Orbit ring */}

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear",
              }}
              className="pointer-events-none absolute -inset-8 rounded-[42px] border border-violet-300/[0.08]"
            />

            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 50,
                repeat: Infinity,
                ease: "linear",
              }}
              className="pointer-events-none absolute -inset-14 rounded-[55px] border border-cyan-300/[0.035]"
            />

            {/* Product glow */}

            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.15, 0.3, 0.15],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="pointer-events-none absolute inset-[10%] rounded-full bg-violet-500/20 blur-[100px]"
            />

            {/* Product card */}

            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.11] bg-[#09090e]/90 shadow-[0_45px_130px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
              {/* Inner card highlight */}

              <div className="pointer-events-none absolute inset-0 rounded-[30px] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),inset_0_0_80px_rgba(139,92,246,0.025)]" />

              {/* Header */}

              <div className="relative flex items-center justify-between border-b border-white/[0.06] px-5 py-4 md:px-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08]">
                    <Sparkles className="relative z-10 h-4 w-4 text-violet-200" />

                    <motion.div
                      animate={{
                        opacity: [0.15, 0.5, 0.15],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 rounded-xl bg-violet-400/20 blur-md"
                    />
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-white">
                      VernacAI Tutor
                    </div>

                    <div className="mt-0.5 text-[8px] text-white/30">
                      Personalized learning session
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.15em] text-emerald-200/70">
                  <motion.span
                    animate={{
                      opacity: [0.35, 1, 0.35],
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                    }}
                    className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.8)]"
                  />
                  AI active
                </div>
              </div>

              {/* Content */}

              <div className="relative p-5 md:p-6">
                <div className="grid items-center gap-4 md:grid-cols-[1fr_42px_1fr]">
                  {/* Source */}

                  <div className="min-h-[220px] rounded-2xl border border-white/[0.07] bg-[#0e0e14] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/25">
                        Source content
                      </span>

                      <span className="text-[9px] text-white/30">
                        English
                      </span>
                    </div>

                    <p className="mt-9 text-sm leading-7 text-white/60">
                      Plants use sunlight, water and carbon dioxide to make
                      their own food.
                    </p>

                    <div className="mt-9 flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-white/25" />

                      <span className="text-[8px] text-white/25">
                        Original educational content
                      </span>
                    </div>
                  </div>

                  {/* AI node */}

                  <div className="flex justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.06, 1],
                        boxShadow: [
                          "0 0 0 rgba(167,139,250,0)",
                          "0 0 32px rgba(167,139,250,0.24)",
                          "0 0 0 rgba(167,139,250,0)",
                        ],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                      }}
                      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-violet-300/20 bg-violet-400/[0.08]"
                    >
                      <Sparkles className="h-4 w-4 text-violet-200" />

                      <motion.div
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.3, 0, 0.3],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                        }}
                        className="absolute inset-0 rounded-full border border-violet-300/20"
                      />
                    </motion.div>
                  </div>

                  {/* Adapted */}

                  <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-violet-300/10 bg-violet-400/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
                    <div className="absolute right-[-30px] top-[-30px] h-28 w-28 rounded-full bg-violet-500/10 blur-[50px]" />

                    <div className="relative flex items-center justify-between">
                      <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-violet-200/55">
                        Adapted content
                      </span>

                      <span className="text-[9px] text-violet-200/70">
                        {activeLanguage}
                      </span>
                    </div>

                    <p className="relative mt-9 text-sm leading-7 text-white/75">
                      మొక్కలు సూర్యకాంతి, నీరు మరియు కార్బన్ డయాక్సైడ్‌ను
                      ఉపయోగించి తమ ఆహారాన్ని తయారు చేసుకుంటాయి.
                    </p>

                    <div className="relative mt-7 flex flex-wrap gap-1.5">
                      {[
                        "Simple vocabulary",
                        "Familiar example",
                        "Class 5",
                      ].map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-violet-300/10 bg-violet-400/[0.06] px-2 py-1 text-[7px] text-violet-100/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Adaptation indicator */}

                <div className="mt-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.06]" />

                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                    }}
                    className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5"
                  >
                    <Check className="h-3 w-3 text-violet-300" />

                    <span className="text-[8px] text-white/35">
                      Pedagogically adapted
                    </span>
                  </motion.div>

                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                {/* Voice */}

                <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-400/[0.08]">
                      <Volume2 className="h-4 w-4 text-violet-200" />
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-white/75">
                        Telugu voice explanation
                      </div>

                      <div className="mt-0.5 text-[8px] text-white/25">
                        Class 5 · Science
                      </div>
                    </div>
                  </div>

                  {/* Wave */}

                  <div className="flex h-7 items-center gap-[2px]">
                    {Array.from({ length: 22 }).map(
                      (_, index) => (
                        <motion.span
                          key={index}
                          animate={{
                            height: [
                              5 + ((index * 7) % 9),
                              8 + ((index * 11) % 17),
                              5 + ((index * 5) % 9),
                            ],
                          }}
                          transition={{
                            duration: 0.8 + (index % 4) * 0.12,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.025,
                          }}
                          className="w-[2px] rounded-full bg-violet-300/55"
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating confirmation */}

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-full border border-emerald-300/10 bg-[#09090e]/90 px-4 py-2.5 text-[9px] text-emerald-100/70 shadow-2xl backdrop-blur-xl md:flex"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10">
                <Check className="h-3 w-3 text-emerald-200" />
              </span>

              Learning adapted for the student
            </motion.div>

            {/* Floating AI status */}

            <motion.div
              animate={{
                y: [0, 9, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-4 top-[10%] hidden rounded-2xl border border-white/[0.09] bg-[#09090e]/90 p-3 shadow-2xl backdrop-blur-xl md:block"
            >
              <div className="flex items-center gap-2">
                <AudioLines className="h-3.5 w-3.5 text-cyan-200/70" />

                <div>
                  <div className="text-[8px] font-medium text-white/65">
                    Adaptive AI
                  </div>

                  <div className="mt-0.5 text-[7px] text-white/30">
                    Context aware
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}

        <motion.div
          animate={{
            y: [0, 7, 0],
            opacity: [0.25, 0.7, 0.25],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
          }}
          className="mt-20 flex items-center justify-center gap-2 text-[8px] uppercase tracking-[0.25em] text-white/25"
        >
          <span className="h-5 w-px bg-white/20" />
          Explore VernacAI
        </motion.div>
      </section>

      {/* =====================================================
          TECHNOLOGY
      ====================================================== */}

      <section
        id="technology"
        className="relative z-10 mx-auto w-[calc(100%-28px)] max-w-[1280px] scroll-mt-8 px-1 pb-28 pt-10 md:w-[calc(100%-56px)] md:px-4 md:pt-20"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
          }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-violet-300/50" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-violet-200/55">
              How VernacAI works
            </span>
          </div>

          <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
            Translation is only
            <span className="text-white/30">
              {" "}
              the beginning.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 md:text-base">
            VernacAI combines language processing with pedagogical
            adaptation so learning is not simply translated — it is reshaped
            for the learner.
          </p>
        </motion.div>

        {/* Pipeline cards */}

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              number: "01",
              title: "Understand",
              text: "Understand the educational content, topic and learner context.",
              icon: Sparkles,
            },
            {
              number: "02",
              title: "Translate",
              text: "Convert content into the learner's preferred Indian language.",
              icon: Languages,
            },
            {
              number: "03",
              title: "Adapt",
              text: "Adjust vocabulary, examples and complexity to the class level.",
              icon: AudioLines,
            },
            {
              number: "04",
              title: "Explain",
              text: "Deliver the lesson through interactive text and voice.",
              icon: Waves,
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.number}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -6,
                }}
                className="group relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition duration-500 hover:border-violet-300/20 hover:bg-white/[0.045]"
              >
                <div className="pointer-events-none absolute right-[-50px] top-[-50px] h-36 w-36 rounded-full bg-violet-500/[0.05] blur-[60px] transition group-hover:bg-violet-500/[0.12]" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-semibold tracking-[0.2em] text-white/25">
                      {item.number}
                    </span>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] transition group-hover:border-violet-300/20 group-hover:bg-violet-400/[0.07]">
                      <Icon className="h-4 w-4 text-violet-200/65" />
                    </div>
                  </div>

                  <h3 className="mt-10 text-lg font-medium text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs leading-6 text-white/35">
                    {item.text}
                  </p>

                  <div className="mt-7 h-px w-full bg-white/[0.06]" />

                  <div className="mt-4 flex items-center gap-1 text-[8px] uppercase tracking-[0.16em] text-white/25 transition group-hover:text-violet-200/60">
                    VernacAI engine

                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Architecture */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
          className="mt-5 rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl md:p-8"
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                VernacAI architecture
              </div>

              <div className="mt-3 text-xl font-medium text-white/80">
                Educational content → AI → Mother tongue learning
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                "React",
                "FastAPI",
                "AI",
                "Translation",
                "Speech",
              ].map((tech, index) => (
                <div
                  key={tech}
                  className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] text-white/40"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-300/65" />

                  {tech}

                  {index < 4 && (
                    <ChevronRight className="h-3 w-3 text-white/10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="relative z-10 mx-auto w-[calc(100%-28px)] max-w-[1280px] px-1 pb-24 md:w-[calc(100%-56px)] md:px-4">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.98,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.8,
          }}
          className="relative overflow-hidden rounded-[32px] border border-violet-300/10 bg-gradient-to-br from-violet-500/[0.1] via-white/[0.025] to-cyan-400/[0.04] p-8 md:p-12"
        >
          <motion.div
            animate={{
              x: [0, 80, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute right-[10%] top-[-100px] h-64 w-64 rounded-full bg-violet-500/10 blur-[90px]"
          />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.25em] text-violet-200/55">
                VernacAI
              </div>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] md:text-5xl">
                Learning should speak
                <span className="text-violet-300">
                  {" "}
                  your language.
                </span>
              </h2>
            </div>

            <button
              onClick={goToStudent}
              className="group flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-semibold text-black transition hover:bg-violet-100"
            >
              Enter VernacAI

              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-10 border-t border-white/[0.06]">
        <div className="mx-auto flex w-[calc(100%-28px)] max-w-[1280px] flex-col justify-between gap-4 py-7 text-[9px] text-white/25 md:w-[calc(100%-56px)] md:flex-row md:items-center">
          <div>
            VernacAI · AI-powered vernacular education
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={goToStudent}
              className="transition hover:text-white/60"
            >
              Students
            </button>

            <button
              onClick={goToTeacher}
              className="transition hover:text-white/60"
            >
              Teachers
            </button>

            <button
              onClick={scrollToTechnology}
              className="transition hover:text-white/60"
            >
              Technology
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;