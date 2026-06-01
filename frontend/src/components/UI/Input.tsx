import { type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs text-textSecondary font-medium">{label}</label>}
      <input
        className={`w-full bg-card border border-border rounded px-2.5 py-1.5 text-sm
          text-textPrimary placeholder-textMuted
          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30
          transition-colors ${className}`}
        {...props}
      />
    </div>
  )
}

interface NumberInputProps {
  label?: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}

export function NumberInput({ label, value, onChange, min, max, step = 1 }: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-xs text-textSecondary font-medium">{label}</label>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min} max={max} step={step}
        className="w-full bg-card border border-border rounded px-2.5 py-1.5 text-sm
          text-textPrimary focus:outline-none focus:border-accent focus:ring-1
          focus:ring-accent/30 transition-colors"
      />
    </div>
  )
}

