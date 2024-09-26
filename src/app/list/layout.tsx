import Logo from "@/components/home/logo";
import { ListItem } from "@/components/home/nav-item";
import { Button } from "@/components/ui/button";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-background w-full  flex-col pt-14 pb-14 px-[15%] gap-24 justify-center items-center">
      {/* Header web mobile*/}
      <Logo />
      {children}
    </div>
  );
}
