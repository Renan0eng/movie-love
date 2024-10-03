"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Props = {
  access_token: boolean;
};

export default function AuthButton({ access_token }: Props) {
  const [session, setSession] = useState<boolean | null>(access_token);
  const router = useRouter();

  // Efeito para buscar a sessão do usuário
  // useEffect(() => {
  //   fetch('/api/user')
  //     .then(response => {
  //       if (response.ok) {
  //         return response.json();
  //       }
  //       return null;
  //     })
  //     .then(data => setSession(data.access_token));
  // }, []);

  useEffect(() => {
    console.log("access_token", access_token);
  }, [access_token]);


  // Função para fazer login
  const signIn = () => {
    router.push('/api/auth/login')
  };

  // Função para fazer logout
  const signOut = () => {
    fetch('/api/auth/logout').then((JSON) => {
      JSON.json().then((data: { logout: boolean }) => {
        if (data.logout) {
          setSession(null);
          router.refresh();
        }
      });
    });
  };

  // Renderiza o botão de logout se o usuário estiver autenticado
  if (session) {
    return (
      <div>
        <Button className="rounded-full" size="lg" variant="default" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  // Renderiza o botão de login se o usuário não estiver autenticado
  return (
    <div>
      <Button className="rounded-full" size="lg" variant="default" onClick={signIn}>
        Sign in
      </Button>
    </div>
  );
}
