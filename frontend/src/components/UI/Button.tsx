import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary:   'bg-accent hover:bg-accentDark text-white border-transparent',
  secondary: 'bg-card hover:bg-hover text-textPrimary border-border',
  ghost:     'bg-transparent hover:bg-hover text-textSecondary hover:text-textPrimary border-transparent',
  danger:    'bg-danger/10 hover:bg-danger/20 text-danger border-danger/30',
  success:   'bg-success/10 hover:bg-success/20 text-success border-success/30',
}

const sizes: Record<Size, string> = {
  sm: 'px-2.5 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded border font-medium
        transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-accent/50
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  )
}

