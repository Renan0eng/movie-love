import Link from "next/link";

export default function Logo() {
  return (
    <div className="flex w-[100%] justify-between items-center top-0 sm:p-0 pl-4">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-text sm:text-5xl text-3xl ">MOVIE LOVE <span className="text-primary">.</span></h1>
      </Link>
    </div>
  );
}