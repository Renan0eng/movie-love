"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";

type Props = {
}

interface QRCodeData {
  text: string;
}
export default function LinkScanView({
}: Props) {
  const [data, setData] = React.useState(null);

  const handleScan = (data: any) => {
    if (data) {
      setData(data);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
  };

  return (
    <div className="flex sm:w-[90%] w-full gap-8 flex-col justify-center">
      {/* qr code */}
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
      {/* btns */}
      <div className="flex justify-between">
        <Button className="rounded-full gap-2" size="xl" variant="outline"><Icon icon="carbon:scan-alt" />Scan</Button>
      </div>
    </div >
  );
};
