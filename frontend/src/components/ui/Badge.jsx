import clsx from "clsx";

const variantToTone = {
  default: 'neutral',
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
};

export function Badge({ children, variant = "default", outline = false, className, ...props }) {
  const tone = variantToTone[variant] || 'neutral';
  const style = outline
    ? {
        backgroundColor: 'transparent',
        color: `var(--tone-${tone}-text)`,
        borderColor: `var(--tone-${tone}-border)`,
      }
    : {
        backgroundColor: `var(--tone-${tone}-bg)`,
        color: `var(--tone-${tone}-text)`,
        borderColor: `var(--tone-${tone}-border)`,
      };

  const base = "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors border";

  return (
    <span role="status" style={style} className={clsx(base, className)} {...props}>
      {children}
    </span>
  );
}
