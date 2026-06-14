interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs text-textSecondary font-medium">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 bg-card border border-border rounded px-2.5 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
        />
        <span className="text-sm text-textPrimary font-mono">
          {value.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
