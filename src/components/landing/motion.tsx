"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { type SectionTone, type StartDemoHandler } from "./types";

export function getRevealVariants(reduceMotion: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.01 : 0.48, ease: "easeOut" },
    },
  };
}

export function getContainerVariants(reduceMotion: boolean | null): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };
}

export function MotionButton({
  children,
  className,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  className: string;
  onClick?: StartDemoHandler;
  type?: "button" | "submit" | "reset";
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      className={className}
      onClick={onClick}
      type={type}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      {children}
    </motion.button>
  );
}

export function SectionWrapper({
  children,
  className = "",
  id,
  tone = "white",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: SectionTone;
}) {
  const reduceMotion = useReducedMotion();
  const toneClass =
    tone === "soft"
      ? "border-y border-slate-200 bg-slate-50"
      : tone === "deep"
        ? "bg-teal-950"
        : "bg-white";

  return (
    <motion.section
      className={`${toneClass} px-4 py-16 sm:px-6 sm:py-20 lg:px-8 ${className}`}
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={getRevealVariants(reduceMotion)}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  inverse?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className={`text-sm font-semibold uppercase tracking-wide ${
          inverse ? "text-teal-200" : "text-teal-700"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${
          inverse ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
      {copy ? (
        <p
          className={`mt-4 text-lg leading-8 ${
            inverse ? "text-teal-50/90" : "text-slate-600"
          }`}
        >
          {copy}
        </p>
      ) : null}
    </div>
  );
}

export function AnimatedGrid({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.16 }}
      variants={getContainerVariants(reduceMotion)}
    >
      {children}
    </motion.div>
  );
}

export function RevealCard({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article className={className} variants={getRevealVariants(reduceMotion)}>
      {children}
    </motion.article>
  );
}

export function Marker({ tone = "teal" }: { tone?: "teal" | "amber" | "slate" }) {
  const color =
    tone === "amber"
      ? "border-amber-200 bg-amber-100 text-amber-800"
      : tone === "slate"
        ? "border-slate-200 bg-slate-100 text-slate-700"
        : "border-teal-200 bg-teal-50 text-teal-800";

  return (
    <span
      aria-hidden="true"
      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${color}`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-current" />
    </span>
  );
}
