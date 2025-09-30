import { Badge } from './ui/Badge';

const STATUS_VARIANTS = {
  masuk: 'success',
  izin: 'warning',
  cuti: 'warning',
  sakit: 'danger',
  dinas: 'info',
  libur: 'info',
  nonaktif: 'danger',
};

function formatLabel(status) {
  if (!status) return '';
  return status
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function ContactStatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();
  const variant = STATUS_VARIANTS[normalized] || 'default';
  return (
    <Badge variant={variant} className="uppercase tracking-wide">
      {formatLabel(normalized || status)}
    </Badge>
  );
}
