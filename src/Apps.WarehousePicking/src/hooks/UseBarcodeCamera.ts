import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function useBarcodeCamera(
  video: HTMLVideoElement | null,
  active: boolean,
  onDecode: (text: string) => void
) {
  const onDecodeRef = useRef(onDecode);
  onDecodeRef.current = onDecode;

  useEffect(() => {
    if (!active || !video) return;

    const reader = new BrowserMultiFormatReader();
    let disposed = false;
    let decoded = false;
    let stopScanning: (() => void) | undefined;

    void reader
      .decodeFromConstraints(
        { audio: false, video: { facingMode: { ideal: "environment" } } },
        video,
        (result) => {
          if (!result || disposed || decoded) return;
          decoded = true;
          onDecodeRef.current(result.getText());
          stopScanning?.();
        }
      )
      .then((controls) => {
        stopScanning = () => controls.stop();
        if (disposed || decoded) stopScanning();
      })
      .catch(() => {
        // Manual barcode entry remains available when camera access is unavailable.
      });

    return () => {
      disposed = true;
      stopScanning?.();
    };
  }, [active, video]);
}