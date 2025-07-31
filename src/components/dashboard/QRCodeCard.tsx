"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type QRCodeCardProps = {
  companyName: string;
  reviewUrl: string;
};

export function QRCodeCard({ companyName, reviewUrl }: QRCodeCardProps) {
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(reviewUrl)}`;

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle>Your Review QR Code</CardTitle>
        <CardDescription>
          Ask customers to scan this code to leave a review for {companyName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center text-center gap-4">
        <div className="p-4 bg-white rounded-lg border">
          <Image
            src={qrCodeApiUrl}
            alt={`QR Code for ${companyName}`}
            width={200}
            height={200}
            data-ai-hint="qr code"
          />
        </div>
        <Button onClick={() => window.open(qrCodeApiUrl)} className="w-full bg-accent hover:bg-accent/90">
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
