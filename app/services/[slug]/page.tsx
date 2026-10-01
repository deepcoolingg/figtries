import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { servicesData } from "@/lib/services-data";

export async function generateStaticParams() {
  return servicesData.map((s) => ({ slug: s.slug }));
}

export const metadata = {
  title: "Figtries",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col overflow-x-hidden">
        <ServiceDetailPage service={service} />
      </main>
      <Footer />
    </>
  );
}
