import { v4 as uuid } from "uuid";
import { fabric } from "fabric";
import type { ShapeStyle } from "../types";

export type ShapeType =
  | "rectangle"
  | "rounded-rectangle"
  | "circle"
  | "ellipse"
  | "triangle"
  | "diamond"
  | "pentagon"
  | "hexagon"
  | "star"
  | "line";

const base = (style: ShapeStyle) =>
  ({
    fill: style.fill,
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    opacity: style.opacity,
    id: uuid(),
  }) as const;

const withMeta = <T extends fabric.Object>(obj: T, shapeType: string): T => {
  obj.set({ customType: "shape", shapeType } as any);
  return obj;
};

const polygon = (cx: number, cy: number, r: number, n: number, rot = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot + (i * Math.PI * 2) / n;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

const star = (cx: number, cy: number, outer: number, inner: number, n = 5) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / n;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

export function createShape(type: ShapeType, style: ShapeStyle): fabric.Object {
  const b = base(style);
  if (type === "rectangle")
    return withMeta(
      new fabric.Rect({ ...b, left: 140, top: 120, width: 220, height: 130 }),
      type,
    );
  if (type === "rounded-rectangle")
    return withMeta(
      new fabric.Rect({
        ...b,
        left: 140,
        top: 120,
        width: 220,
        height: 130,
        rx: 16,
        ry: 16,
      }),
      type,
    );
  if (type === "circle")
    return withMeta(
      new fabric.Circle({ ...b, left: 170, top: 120, radius: 70 }),
      type,
    );
  if (type === "ellipse")
    return withMeta(
      new fabric.Ellipse({ ...b, left: 130, top: 120, rx: 120, ry: 70 }),
      type,
    );
  if (type === "triangle")
    return withMeta(
      new fabric.Triangle({
        ...b,
        left: 170,
        top: 120,
        width: 160,
        height: 140,
      }),
      type,
    );
  if (type === "diamond")
    return withMeta(
      new fabric.Polygon(polygon(250, 190, 90, 4, Math.PI / 4), b as any),
      type,
    );
  if (type === "pentagon")
    return withMeta(
      new fabric.Polygon(polygon(250, 190, 90, 5, -Math.PI / 2), b as any),
      type,
    );
  if (type === "hexagon")
    return withMeta(
      new fabric.Polygon(polygon(250, 190, 90, 6, Math.PI / 6), b as any),
      type,
    );
  if (type === "star")
    return withMeta(new fabric.Polygon(star(250, 190, 95, 45), b as any), type);
  return withMeta(
    new fabric.Line([80, 120, 460, 260], {
      ...b,
      fill: "",
      strokeLineCap: "round",
    } as any),
    "line",
  );
}

export const SHAPE_OPTIONS: { value: ShapeType; label: string }[] = [
  { value: "rectangle", label: "Rectangle" },
  { value: "rounded-rectangle", label: "Rounded Rectangle" },
  { value: "circle", label: "Circle" },
  { value: "ellipse", label: "Ellipse" },
  { value: "triangle", label: "Triangle" },
  { value: "diamond", label: "Diamond" },
  { value: "pentagon", label: "Pentagon" },
  { value: "hexagon", label: "Hexagon" },
  { value: "star", label: "Star" },
  { value: "line", label: "Line" },
];
