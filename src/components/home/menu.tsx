import Image from "next/image";

export default function Menu() {
  return (
    <div className="absolute top-8 right-8">
      <Image src="/Avatar.png" height={40} width={40} className="rounded-full border-primary border-2  bg-background" alt="" />
    </div>
  );
}