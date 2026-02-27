/**
 * Premium StatCard Component
 * Features: Accent bar, semantic colors, trend indicators
 */

export function StatCard({ 
    label, 
    value, 
    subtitle, 
    trend, 
    trendDirection,
    icon,
    accent = 'default' // 'default' | 'success' | 'warning' | 'error'
}) {
    const accentClasses = {
        default: 'stat-card--default',
        success: 'stat-card--success',
        warning: 'stat-card--warning',
        error: 'stat-card--error'
    };

    return (
        <div className={`stat-card ${accentClasses[accent] || accentClasses.default}`}>
            <div className="stat-card__accent"></div>
            <div className="stat-card__content">
                <div className="stat-card__header">
                    <span className="stat-card__label">{label}</span>
                    {icon && <span className="stat-card__icon">{icon}</span>}
                </div>
                <div className="stat-card__value">{value}</div>
                <div className="stat-card__footer">
                    {trend && (
                        <span className={`stat-card__trend ${trendDirection === 'up' ? 'is-up' : trendDirection === 'down' ? 'is-down' : ''}`}>
                            {trendDirection === 'up' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="18 15 12 9 6 15"/>
                                </svg>
                            )}
                            {trendDirection === 'down' && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="6 9 12 15 18 9"/>
                                </svg>
                            )}
                            <span>{trend}</span>
                        </span>
                    )}
                    {subtitle && <span className="stat-card__subtitle">{subtitle}</span>}
                </div>
            </div>
        </div>
    );
}

/* Stat Card Icons */
export function RevenueIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
    );
}

export function PendingIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
        </svg>
    );
}

export function PaidIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
    );
}

export function OverdueIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
    );
}