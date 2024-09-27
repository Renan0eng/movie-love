import Logo from "@/components/home/logo";
import Menu from "@/components/home/menu";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-background w-full  flex-col sm:pt-14 pt-8 pb-14 xl:px-[15%] sm:px-[5%] px-1 sm:gap-24 gap-8 justify-center items-center">
      {/* Header web mobile*/}
      <Logo />
      <Menu />
      {children}
    </div>
  );
}
