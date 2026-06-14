import { createContext, useContext, useRef, type RefObject } from "react";
import type { fabric } from "fabric";

interface CanvasCtx {
  canvasRef: RefObject<fabric.Canvas | null>;
}

const CanvasContext = createContext<CanvasCtx | null>(null);

export { CanvasContext };

export function useCanvasCtx(): CanvasCtx {
  const ctx = useContext(CanvasContext);
  if (!ctx)
    throw new Error("useCanvasCtx must be used inside <CanvasProvider>");
  return ctx;
}
