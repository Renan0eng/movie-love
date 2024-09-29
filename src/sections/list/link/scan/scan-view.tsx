"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { IDetectedBarcode, Scanner, } from '@yudiel/react-qr-scanner';
import { useRouter } from "next/navigation";

type Props = {};


export default function LinkScanView({ }: Props) {

  const [code, setCode] = React.useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const router = useRouter();

  useEffect(() => {
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

  const linkList = () => {
    fetch('api/list/linklist', {
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

  React.useEffect(() => {
    alert(code);
  }, [code]);

  const handleScan = (data: IDetectedBarcode[]) => {
    if (data) {
      setCode(data[0].rawValue ? data[0].rawValue : null);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className="flex sm:w-[90%] w-full gap-8 flex-col justify-center">
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
      {/* Buttons */}
      <div className="flex justify-between">
        {code && <Button className="rounded-full gap-2" size="xl" variant="outline"
          onClick={() => {
            linkList();
          }}
        >
          <Icon icon="carbon:arrow-left" />Back
        </Button>}
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
