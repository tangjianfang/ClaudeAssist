import { Badge } from './Badge';
import type { AiToolStatus } from '../../data/ai-ecosystem';

interface StatusBadgeProps {
  status: AiToolStatus | undefined;
}

const config: Record<Exclude<AiToolStatus, 'stable'>, { label: string; variant: 'success' | 'warning' | 'danger' | 'muted' }> = {
  preview:    { label: 'Preview',  variant: 'warning' },
  unverified: { label: '未核验',   variant: 'danger'  },
  deprecated: { label: '已废弃',   variant: 'muted'   },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status || status === 'stable') return null;
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
