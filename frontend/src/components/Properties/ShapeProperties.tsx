import { type fabric } from "fabric";
import { ColorPicker } from "../UI/ColorPicker";
import { NumberInput } from "../UI/Input";
import { Slider } from "../UI/Select";
import { usePresentationStore } from "../../store/usePresentationStore";
import { LinkProperties } from "./LinkProperties";

interface Props {
  obj: fabric.Object;
  canvas: fabric.Canvas;
}

const supportsFill = (obj: fabric.Object) => obj.type !== "line";

export function ShapeProperties({ obj, canvas }: Props) {
  const { setShapeStyle } = usePresentationStore();

  const apply = (
    props: Record<string, unknown>,
    style?: Record<string, unknown>,
  ) => {
    obj.set(props as any);
    if (style) setShapeStyle(style as any);
    canvas.renderAll();
    canvas.fire("object:modified", { target: obj } as any);
  };

  const fill = (obj.fill as string) || "#8b5cf6";
  const stroke = (obj.stroke as string) || "#4c1d95";
  const strokeWidth = Number(obj.strokeWidth ?? 2);
  const opacity = Number(obj.opacity ?? 1);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
        Shape
      </h3>
      {supportsFill(obj) && (
        <ColorPicker
          label="Fill"
          value={fill}
          onChange={(v) => apply({ fill: v }, { fill: v })}
        />
      )}
      <ColorPicker
        label="Border Color"
        value={stroke}
        onChange={(v) => apply({ stroke: v }, { stroke: v })}
      />
      <NumberInput
        label="Border Width"
        value={strokeWidth}
        min={0}
        step={0.5}
        onChange={(v) => apply({ strokeWidth: v }, { strokeWidth: v })}
      />
      <Slider
        label={`Opacity: ${Math.round(opacity * 100)}%`}
        value={opacity}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => apply({ opacity: v }, { opacity: v })}
      />
      <div className="h-px bg-border -mx-4" />
      <div className="-mx-4 -my-4">
        <LinkProperties obj={obj} canvas={canvas} />
      </div>
    </div>
  );
}
