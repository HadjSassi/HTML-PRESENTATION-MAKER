interface SelectProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs text-textSecondary font-medium">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-card border border-border rounded px-2.5 py-1.5 text-sm
          text-textPrimary focus:outline-none focus:border-accent focus:ring-1
          focus:ring-accent/30 transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface SliderProps {
  label?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: SliderProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <div className="flex justify-between">
          <label className="text-xs text-textSecondary font-medium">
            {label}
          </label>
          <span className="text-xs text-textMuted">{value}</span>
        </div>
      )}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </div>
  );
}
