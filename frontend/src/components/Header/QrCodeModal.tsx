import { Modal } from "../UI/Modal";
import { QRCodeCanvas } from "qrcode.react";

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
}

export function QrCodeModal({ open, onClose }: QrCodeModalProps) {
  const url = `${window.location.origin}/`;

  return (
    <Modal open={open} onClose={onClose} title="Scan QR Code to Join">
      <div className="p-6 flex flex-col items-center justify-center">
        <div className="p-4 bg-white rounded-lg">
          <QRCodeCanvas value={url} size={256} />
        </div>
        <p className="mt-4 text-center text-textMuted text-sm">
          Scan this code with your phone to view the presentation.
        </p>
        <p className="mt-2 text-center text-textMuted text-xs">
          Or open this link:{" "}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {url}
          </a>
        </p>
      </div>
    </Modal>
  );
}
