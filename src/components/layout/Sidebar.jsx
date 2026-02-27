import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';

export function Sidebar() {
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <aside className="sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <BrandLogo size="sm" showTagline={true} />
            </div>

            {/* Main Navigation */}
            <nav className="sidebar-nav">
                <div className="sidebar-section">
                    <span className="sidebar-section-label">Menu</span>
                    <div className="sidebar-links">
                        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`} end>
                            <span className="sidebar-link-indicator"></span>
                            <svg className="sidebar-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <rect x="3" y="3" width="7" height="7" rx="1"/>
                                <rect x="14" y="3" width="7" height="7" rx="1"/>
                                <rect x="3" y="14" width="7" height="7" rx="1"/>
                                <rect x="14" y="14" width="7" height="7" rx="1"/>
                            </svg>
                            <span className="sidebar-link-text">Dashboard</span>
                        </NavLink>
                        <NavLink to="/invoices" className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`} end>
                            <span className="sidebar-link-indicator"></span>
                            <svg className="sidebar-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <path d="M14 2v6h6"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                            <span className="sidebar-link-text">Invoices</span>
                        </NavLink>
                        <NavLink to="/clients" className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`} end>
                            <span className="sidebar-link-indicator"></span>
                            <svg className="sidebar-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                            </svg>
                            <span className="sidebar-link-text">Clients</span>
                        </NavLink>
                    </div>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-section-label">Quick Actions</span>
                    <div className="sidebar-links">
                        <NavLink to="/invoices/new" className={({ isActive }) => `sidebar-link sidebar-link-create${isActive ? ' is-active' : ''}`}>
                            <span className="sidebar-link-indicator"></span>
                            <svg className="sidebar-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            <span className="sidebar-link-text">New Invoice</span>
                        </NavLink>
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <NavLink to="/settings" className={({ isActive }) => `sidebar-link${isActive ? ' is-active' : ''}`}>
                    <span className="sidebar-link-indicator"></span>
                    <svg className="sidebar-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                    </svg>
                    <span className="sidebar-link-text">Settings</span>
                </NavLink>
                <button className="sidebar-link sidebar-signout" onClick={handleSignOut}>
                    <svg className="sidebar-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    <span className="sidebar-link-text">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}