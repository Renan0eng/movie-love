"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { IDetectedBarcode, Scanner, } from '@yudiel/react-qr-scanner';
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {};


export default function LinkScanView({ }: Props) {

  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const [code, setCode] = React.useState<string>("");

  const router = useRouter();

  React.useEffect(() => {
    const getVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Erro ao acessar a câmera:', err);
        alert(`Erro ao acessar a câmera: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    getVideoStream();

    // Limpeza do stream ao desmontar o componente
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, []);

  const linkList = (code: string | null | undefined) => {
    fetch('/api/list/linklist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
      }),
    })
      .then(response => response.json())
      .then(() => {
        router.push('/list');
        console.log('Success');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleScan = (data: IDetectedBarcode[]) => {
    if (data) {
      setCode(data[0].rawValue ? data[0].rawValue : "");
      linkList(data[0].rawValue ? data[0].rawValue : "");
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className="flex sm:w-[90%] w-full gap-8 flex-col justify-center px-4">
      {/* QR code scanner */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D1C22',
        padding: '20px',
        borderRadius: '10px',
      }}>
        <div style={{
          width: '300px',
          height: '300px',
        }}>
          <Scanner
            onScan={handleScan}
            onError={handleError}
          />
        </div>
      </div>
      {/* input */}
      <div className="flex flex-col gap-2 px-4 justify-center items-center">
        <Label htmlFor="code" className="text-text text-md">Or paste the code here</Label>
        <Input type="text" className=" bg-background justify-center items-center text-text" value={code} onChange={(e) => setCode(e.target.value)} />
      </div>
      {/* Buttons */}
      <div className="flex justify-between">
        <Button className="rounded-full gap-2" size="xl" variant="outline"
          onClick={() => {
            linkList(code);
          }}
        >
          <Icon icon="carbon:link" />Link
        </Button>
        <Button className="rounded-full gap-2" size="xl" variant="outline"
          onClick={() => {
            router.back();
          }}
        >
          <Icon icon="carbon:arrow-left" />Back
        </Button>
      </div>
    </div>
  );
}
