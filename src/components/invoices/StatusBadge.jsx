import { Badge } from '../common/Badge';

const statusConfig = {
    draft: { label: 'Draft', variant: 'default' },
    pending: { label: 'Pending', variant: 'warning' },
    paid: { label: 'Paid', variant: 'success' },
    overdue: { label: 'Overdue', variant: 'error' },
    cancelled: { label: 'Cancelled', variant: 'default' }
};

export function StatusBadge({ status, size = 'md' }) {
    const config = statusConfig[status] || statusConfig.draft;

    return (
        <Badge variant={config.variant} size={size} className="status-badge badge-dot">
            {config.label}
        </Badge>
    );
}
