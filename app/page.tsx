import Hero from "@/components/Hero";
import DemoFlowScroll from "@/components/DemoFlowScroll";
import HowItWorksTabs from "@/components/HowItWorksTabs";
import StatsCounter from "@/components/StatsCounter";
import CTASection from "@/components/CTASection";

export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      <section id="demo" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <DemoFlowScroll />
      </section>
      <StatsCounter />
      <section id="how" className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <HowItWorksTabs />
        </div>
      </section>
      <section id="cta" className="bg-cta text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <CTASection />
        </div>
      </section>
    </div>
  );
}
