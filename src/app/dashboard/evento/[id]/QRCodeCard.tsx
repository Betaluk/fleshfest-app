'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeCard({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-xl w-full max-w-sm mx-auto">
      {/* O componente que desenha o QR Code na tela */}
      <QRCodeSVG value={url} size={200} />
      
      <p className="text-zinc-900 font-semibold mt-6 text-center text-sm break-all bg-zinc-100 p-2 rounded">
        {url}
      </p>
    </div>
  );
}