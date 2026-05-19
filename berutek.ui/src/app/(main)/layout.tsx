import Footer from "@/src/components/layout/footer";
import Header from "@/src/components/layout/header";

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full items-center bg-zinc-50 font-sans dark:bg-black">
        <Header />
        {children}
        <Footer />
        </div>
    );
}