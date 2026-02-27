import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from '../components/common/BrandLogo';

export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signIn(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth">
            <div className="auth__container">
                {/* Brand */}
                <div className="auth__brand">
                    <BrandLogo size="md" showTagline={true} />
                </div>

                {/* Header */}
                <div className="auth__header">
                    <h1 className="auth__title">Welcome back</h1>
                    <p className="auth__subtitle">Sign in to continue to your dashboard</p>
                </div>

                {/* Form */}
                <form className="auth__form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth__error">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="auth__field">
                        <label className="auth__label" htmlFor="email">
                            Email address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="auth__input"
                            placeholder="you@company.com"
                            required
                            autoComplete="email"
                            autoFocus
                        />
                    </div>

                    <div className="auth__field">
                        <label className="auth__label" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="auth__input"
                            placeholder="Enter your password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth__submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="auth__submit-loader"></span>
                        ) : (
                            <span>Sign in</span>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <div className="auth__footer">
                    <p className="auth__footer-text">
                        Powered by <span className="auth__footer-brand">The Brick Dev</span>
                    </p>
                </div>
            </div>

            {/* Background decoration */}
            <div className="auth__bg">
                <div className="auth__bg-gradient"></div>
            </div>
        </div>
    );
}