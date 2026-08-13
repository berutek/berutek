import Footer from "@/src/components/layout/footer";
import Header from "@/src/components/layout/header";
import PageTransition from "@/src/components/layout/page_transition";
import ParallaxBackground from "@/src/components/layout/parallax_background";

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full items-center font-sans">
      <ParallaxBackground />
      <Header />
      <main className="relative z-1 w-full flex-1">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
