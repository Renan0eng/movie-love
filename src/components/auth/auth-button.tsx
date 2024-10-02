"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        {/* <button onClick={() => signOut()}>Sair</button> */}
        <Button className="rounded-full " size="lg" variant="default" onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  return (
    <div>
      {/* <button onClick={() => signIn("google")}>Entrar com Google</button> */}
      <Button className="rounded-full " size="lg" variant="default" onClick={() => signIn("google")}>Sign in</Button>
    </div>
  );
}
