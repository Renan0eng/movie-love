"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { Scanner } from '@yudiel/react-qr-scanner';

type Props = {};

interface QRCodeData {
  text: string;
}

export default function LinkScanView({ }: Props) {
  const [data, setData] = React.useState<QRCodeData | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  const handleScan = (data: any) => {
    if (data) {
      setData(data);
      alert(JSON.stringify(data));
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
        <Button className="rounded-full gap-2" size="xl" variant="outline">
          <Icon icon="carbon:scan-alt" />Scan
        </Button>
      </div>
    </div>
  );
}
