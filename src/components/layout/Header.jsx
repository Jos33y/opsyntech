import { useLocation } from 'react-router-dom';

const pageTitles = {
    '/': 'Dashboard',
    '/invoices': 'Invoices',
    '/invoices/new': 'New Invoice',
    '/clients': 'Clients',
    '/settings': 'Settings'
};

export function Header() {
    const location = useLocation();
    
    const getTitle = () => {
        if (location.pathname.startsWith('/invoices/') && location.pathname !== '/invoices/new') {
            if (location.pathname.endsWith('/edit')) {
                return 'Edit Invoice';
            }
            return 'Invoice';
        }
        return pageTitles[location.pathname] || 'OPSYN';
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    {/* Mobile Logo - only shows on mobile */}
                    <div className="header-logo">
                        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="32" cy="32" r="26" stroke="#FF6B00" strokeWidth="4" fill="none"/>
                            <rect x="30" y="12" width="4" height="14" rx="2" fill="#FF6B00"/>
                        </svg>
                    </div>
                    {/* Desktop Title */}
                    <h1 className="header-title">{getTitle()}</h1>
                </div>
                <div className="header-right">
                    {/* Notification bell - subtle, no badge for now */}
                    <button className="header-btn" aria-label="Notifications">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 01-3.46 0"/>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}