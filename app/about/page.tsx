import Header from "../../components/Header";
import AboutUs from "../../components/AboutUs";
import Footer from "../../components/Footer";

export const metadata = {
  title: "About Us | Figtries",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col overflow-x-hidden">
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}