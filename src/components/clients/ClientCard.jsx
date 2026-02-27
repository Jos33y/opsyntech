export function ClientCard({ client, onEdit, onDelete }) {
    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit?.(client);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete?.(client.id);
    };

    // Generate color from name
    const getAvatarColor = (name) => {
        const colors = [
            'var(--color-primary)',
            'var(--color-success)',
            'var(--color-warning)',
            '#8B5CF6', // purple
            '#EC4899', // pink
            '#06B6D4', // cyan
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const avatarColor = getAvatarColor(client.name || 'C');

    return (
        <div className="client-card">
            <div className="client-card__inner">
                {/* Avatar & Info */}
                <div className="client-card__main">
                    <div 
                        className="client-card__avatar" 
                        style={{ backgroundColor: avatarColor + '20', color: avatarColor }}
                    >
                        {(client.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="client-card__info">
                        <div className="client-card__name">{client.name}</div>
                        {client.company_name && (
                            <div className="client-card__company">{client.company_name}</div>
                        )}
                    </div>
                </div>

                {/* Contact Details */}
                <div className="client-card__details">
                    {client.email && (
                        <div className="client-card__detail">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                            <span>{client.email}</span>
                        </div>
                    )}
                    {client.phone && (
                        <div className="client-card__detail">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                            </svg>
                            <span>{client.phone}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="client-card__actions">
                    <button className="client-card__action" onClick={handleEdit} title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button className="client-card__action client-card__action--danger" onClick={handleDelete} title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}