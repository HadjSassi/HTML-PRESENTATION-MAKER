import { fabric } from "fabric";

type Arrange = "front" | "forward" | "backward" | "back";

const getApi = (canvas: fabric.Canvas) =>
  canvas as fabric.Canvas & {
    hpmUndo?: () => void;
    hpmRedo?: () => void;
  };

export function selectAllObjects(canvas: fabric.Canvas) {
  const objects = canvas
    .getObjects()
    .filter((obj) => (obj as any).customType !== "shape-guide");
  if (!objects.length) return;
  canvas.discardActiveObject();
  if (objects.length === 1) canvas.setActiveObject(objects[0]);
  else canvas.setActiveObject(new fabric.ActiveSelection(objects, { canvas }));
  canvas.requestRenderAll();
}

export function deleteActiveObject(canvas: fabric.Canvas) {
  const active = canvas.getActiveObject() as fabric.Object | undefined;
  if (!active) return;
  if (active.type === "activeSelection") {
    (active as fabric.ActiveSelection)
      .getObjects()
      .forEach((obj) => canvas.remove(obj));
  } else {
    canvas.remove(active);
  }
  canvas.discardActiveObject();
  canvas.requestRenderAll();
}

export function duplicateActiveObject(canvas: fabric.Canvas) {
  const active = canvas.getActiveObject() as any;
  if (!active) return;
  active.clone((cloned: any) => {
    if (
      active.type === "activeSelection" &&
      cloned.type === "activeSelection"
    ) {
      cloned.canvas = canvas;
      cloned.getObjects().forEach((obj: any) => {
        obj.set({ left: (obj.left ?? 0) + 20, top: (obj.top ?? 0) + 20 });
        canvas.add(obj);
      });
      canvas.setActiveObject(
        new fabric.ActiveSelection(cloned.getObjects(), { canvas }),
      );
    } else {
      cloned.set({
        left: (active.left ?? 0) + 20,
        top: (active.top ?? 0) + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
    }
    canvas.requestRenderAll();
  });
}

export function arrangeObject(canvas: fabric.Canvas, mode: Arrange) {
  const active = canvas.getActiveObject();
  if (!active) return;
  if (mode === "front") canvas.bringToFront(active);
  if (mode === "forward") canvas.bringForward(active);
  if (mode === "backward") canvas.sendBackwards(active);
  if (mode === "back") canvas.sendToBack(active);
  canvas.requestRenderAll();
  canvas.fire("object:modified", { target: active } as any);
}

export function undoCanvas(canvas: fabric.Canvas) {
  getApi(canvas).hpmUndo?.();
}

export function redoCanvas(canvas: fabric.Canvas) {
  getApi(canvas).hpmRedo?.();
}
