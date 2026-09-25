import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PremiumBackground() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-[#050507]" />

      {/* Cursor-following atmospheric glow */}
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full"
        animate={{
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
        }}
        transition={{
          type: "spring",
          stiffness: 35,
          damping: 25,
          mass: 0.5,
        }}
        style={{
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0.05) 35%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Main purple atmosphere */}
      <motion.div
        className="absolute left-1/2 top-[20%] h-[650px] w-[900px] -translate-x-1/2 rounded-full"
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(ellipse, rgba(124,58,237,0.16), rgba(88,28,135,0.06) 45%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />

      {/* Cyan atmospheric accent */}
      <motion.div
        className="absolute right-[-10%] top-[35%] h-[450px] w-[450px] rounded-full"
        animate={{
          x: [-20, 20, -20],
          y: [10, -15, 10],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.12), transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Cinematic grid */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(167,139,250,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(167,139,250,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 80%)",
        }}
      />

      {/* Floating light particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-violet-300/30"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "-15vh"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35%]"
        style={{
          background:
            "linear-gradient(to top, #050507, transparent)",
        }}
      />
    </div>
  );
}