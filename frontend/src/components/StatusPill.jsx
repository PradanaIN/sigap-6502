import { Badge } from "./ui/Badge";
import clsx from "clsx";

const DOT_COLOR_BY_VARIANT = {
  default: 'var(--tone-neutral-dot)',
  success: 'var(--tone-success-dot)',
  danger: 'var(--tone-danger-dot)',
  warning: 'var(--tone-warning-dot)',
  info: 'var(--tone-info-dot)',
};

const PHASE_CONFIG = {
  idle: { label: 'Bot belum berjalan', variant: 'default' },
  starting: { label: 'Menyalakan bot...', variant: 'warning' },
  'waiting-qr': { label: 'Menunggu pemindaian QR', variant: 'warning' },
  authenticated: { label: 'QR terscan, menunggu siap', variant: 'warning' },
  restarting: { label: 'Bot sedang restart', variant: 'warning' },
  ready: { label: 'Bot aktif', variant: 'success' },
  stopped: { label: 'Bot dihentikan', variant: 'default' },
  error: { label: 'Terjadi kesalahan autentikasi', variant: 'danger' },
};

export function StatusPill({
  active,
  phase,
  labelActive = 'Bot Aktif',
  labelInactive = 'Bot Nonaktif',
}) {
  const dotBase = 'inline-flex h-2.5 w-2.5 rounded-full';
  const phaseKey = typeof phase === 'string' ? phase : undefined;

  const fallback = active
    ? { label: labelActive, variant: 'success' }
    : { label: labelInactive, variant: 'danger' };

  const phaseConfig = phaseKey ? PHASE_CONFIG[phaseKey] : undefined;
  const variant = phaseConfig?.variant ?? fallback.variant;
  const dotColor = DOT_COLOR_BY_VARIANT[variant] || DOT_COLOR_BY_VARIANT.default;

  let displayLabel = phaseConfig?.label ?? fallback.label;
  if (phaseKey === 'ready') {
    displayLabel = labelActive;
  } else if (!phaseConfig) {
    displayLabel = fallback.label;
  }

  return (
    <Badge variant={variant} className="flex items-center gap-2" data-phase={phaseKey}>
      <span className={clsx(dotBase)} style={{ backgroundColor: dotColor }} />
      {displayLabel}
    </Badge>
  );
}
