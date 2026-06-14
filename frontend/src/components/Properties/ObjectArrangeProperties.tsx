import { type fabric } from "fabric";
import { ArrowBigDown, ArrowBigUp, MoveDown, MoveUp } from "lucide-react";
import { arrangeObject } from "../../hooks/useCanvasActions";

interface Props {
  canvas: fabric.Canvas;
}

const BTN =
  "flex items-center justify-center gap-1 px-2 py-1 rounded border border-border text-xs text-textSecondary hover:text-textPrimary hover:border-borderActive";

export function ObjectArrangeProperties({ canvas }: Props) {
  const active = canvas.getActiveObject();
  if (!active) return null;

  return (
    <div className="p-4 flex flex-col gap-3 border-t border-border">
      <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
        Arrange
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <button className={BTN} onClick={() => arrangeObject(canvas, "front")}>
          <ArrowBigUp size={14} /> To Front
        </button>
        <button className={BTN} onClick={() => arrangeObject(canvas, "back")}>
          <ArrowBigDown size={14} /> To Back
        </button>
        <button
          className={BTN}
          onClick={() => arrangeObject(canvas, "forward")}
        >
          <MoveUp size={14} /> Forward
        </button>
        <button
          className={BTN}
          onClick={() => arrangeObject(canvas, "backward")}
        >
          <MoveDown size={14} /> Backward
        </button>
      </div>
    </div>
  );
}
