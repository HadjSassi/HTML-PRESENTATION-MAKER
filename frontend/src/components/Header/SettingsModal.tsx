import { Modal } from "../UI/Modal";
import { useSettingsStore } from "../../store/useSettingsStore";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: Props) {
  const { theme, setTheme, showRulers, toggleRulers, snapToGrid, toggleSnap } =
    useSettingsStore();

  return (
    <Modal open={open} title="Settings" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs text-textSecondary font-medium">
            Display Mode
          </label>
          <div className="flex gap-2">
            {(["dark", "light"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setTheme(m)}
                className={`px-3 py-1.5 rounded text-xs border ${
                  theme === m
                    ? "bg-accent/15 border-accent text-accent"
                    : "bg-card border-border text-textSecondary hover:text-textPrimary"
                }`}
              >
                {m[0].toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <label className="flex items-center justify-between text-sm text-textPrimary">
          <span>Show rulers (coming soon)</span>
          <input type="checkbox" checked={showRulers} onChange={toggleRulers} />
        </label>

        <label className="flex items-center justify-between text-sm text-textPrimary">
          <span>Snap to grid (coming soon)</span>
          <input type="checkbox" checked={snapToGrid} onChange={toggleSnap} />
        </label>
      </div>
    </Modal>
  );
}
