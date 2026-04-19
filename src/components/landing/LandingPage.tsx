"use client";

import { useRouter } from "next/navigation";

import { Header } from "./Header";
import { HeroSection } from "./HeroSection";
import {
  CommonSituationsSection,
  ExampleOutputSection,
  FAQSection,
  FinalCTASection,
  HowItWorksSection,
  TrustSection,
  TrustStrip,
  WhatItReviewsSection,
  WhyThisMattersSection,
} from "./sections";

export function LandingPage() {
  const router = useRouter();

  const handleStartDemo = () => {
    router.push("/dashboard/intake");
  };

  return (
    <main className="min-h-screen scroll-smooth bg-white font-sans text-slate-950 selection:bg-teal-200">
      <Header onStartDemo={handleStartDemo} />
      <HeroSection onStartDemo={handleStartDemo} />
      <TrustStrip />
      <WhyThisMattersSection />
      <CommonSituationsSection />
      <WhatItReviewsSection />
      <ExampleOutputSection />
      <HowItWorksSection onStartDemo={handleStartDemo} />
      <FAQSection />
      <FinalCTASection onStartDemo={handleStartDemo} />
      <TrustSection />
    </main>
  );
}
