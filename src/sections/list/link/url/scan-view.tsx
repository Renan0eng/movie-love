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
    console.log(token);
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
        console.log(`http://localhost:3000/list/linklist/url/${code}`);

      })
      .catch((error) => {
        console.error('Error:', error);
        console.log('Error:', error);
      });
  }, [token]);


  return (
    <div>
      <h1>LinkCodeView</h1>
    </div>
  );
}