import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import FloatingLeavesBackground from "../components/FloatingLeavesBackground";
import Process from "../components/Process";
import WhyChooseUs from "../components/WhyChooseUs";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export const metadata = {
  title: "Figtries",
};

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex min-h-screen flex-col overflow-x-hidden">
        <section className="relative overflow-hidden bg-[#f4f4f4]">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <FloatingLeavesBackground />
          </div>

          <div className="relative z-10">
            <Hero />
            <Services />
          </div>
        </section>

        <Process />
        <WhyChooseUs />
        <CallToAction />
      </main>

      <Footer />
    </>
  );
}