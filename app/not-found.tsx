import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white">
      <div className="relative hidden h-screen w-full sm:block">
        <Image
          src="/404.webp"
          alt="404 page not found"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-8 sm:hidden">
        <div className="relative h-[76svh] w-full max-w-115">
          <Image
            src="/404-mobile.webp"
            alt="404 page not found mobile"
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center px-4 sm:bottom-10">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-white/40 bg-black/30 px-6 py-3 text-sm font-heading text-white backdrop-blur-sm transition-colors duration-300 hover:border-white hover:bg-black/55"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}