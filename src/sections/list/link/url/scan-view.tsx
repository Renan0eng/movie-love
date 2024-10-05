'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  token: string | undefined;
  code: string
}
export default function LinkCodeView({ token, code }: Props) {

  const router = useRouter();




  useEffect(() => {
    if (!token) {
      router.refresh();
    }
    fetch('/api/set-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    })
      .then(response => response.json())
      .then(() => {
        console.log('Success');
        router.refresh();
      })
      .catch((error) => {
        console.error('Error:', error);
        console.log('Error:', error);
      });
  }, [token]);


  return (
    <div>
      {/* loader link code */}
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl font-bold text-text">
          Connecting to the list...
        </p>
      </div>
    </div>
  );
}