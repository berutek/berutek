import { Metadata } from "next";

export const metadata: Metadata = {
  title: "BeruTek - Authentication",
  description: "Login or register to access your BeruTek account and manage your freelance projects, connect with clients, and showcase your skills on our AI-powered freelance marketplace.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 w-full items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full h-screen flex p-5 justify-center">
      <div className=" rounded-t-lg p-15 font-bold text-4xl flex flex-col justify-end text-amber-100 dark:text-amber-100 gap-4" style={{ backgroundImage: "url('/login-background-sidepanel.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", backgroundBlendMode: "darken" }}>
        <img src="/berutek.icon.png" alt="" className="w-16" />
        <span>BeruTek</span>
        <p>Will help you growing your business with professional assistance services.</p>
      </div>
    </div>
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      {children}
    </div>
    </div>
  );
}