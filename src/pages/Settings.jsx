import { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { Input, Textarea, Select } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ContentLoader } from '../components/common/Loader';
import { useToast } from '../components/common/Toast';

export default function Settings() {
    const { profile, loading, updateProfile } = useProfile();
    const { updatePassword, signOut } = useAuth();
    const toast = useToast();

    const [businessForm, setBusinessForm] = useState({
        company_name: '',
        tagline: '',
        rc_number: '',
        address: '',
        phone: '',
        email: ''
    });

    const [bankForm, setBankForm] = useState({
        bank_name: '',
        account_name: '',
        account_number: ''
    });

    const [invoiceForm, setInvoiceForm] = useState({
        invoice_prefix: 'INV',
        default_due_days: 7,
        default_notes: '',
        currency: 'NGN'
    });

    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [savingBusiness, setSavingBusiness] = useState(false);
    const [savingBank, setSavingBank] = useState(false);
    const [savingInvoice, setSavingInvoice] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (profile) {
            setBusinessForm({
                company_name: profile.company_name || '',
                tagline: profile.tagline || '',
                rc_number: profile.rc_number || '',
                address: profile.address || '',
                phone: profile.phone || '',
                email: profile.email || ''
            });
            setBankForm({
                bank_name: profile.bank_name || '',
                account_name: profile.account_name || '',
                account_number: profile.account_number || ''
            });
            setInvoiceForm({
                invoice_prefix: profile.invoice_prefix || 'INV',
                default_due_days: profile.default_due_days || 7,
                default_notes: profile.default_notes || '',
                currency: profile.currency || 'NGN'
            });
        }
    }, [profile]);

    const handleBusinessChange = (e) => {
        const { name, value } = e.target;
        setBusinessForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setBankForm(prev => ({ ...prev, [name]: value }));
    };

    const handleInvoiceChange = (e) => {
        const { name, value } = e.target;
        setInvoiceForm(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBusinessSubmit = async (e) => {
        e.preventDefault();
        setSavingBusiness(true);
        try {
            await updateProfile(businessForm);
            toast.success('Business profile updated');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setSavingBusiness(false);
        }
    };

    const handleBankSubmit = async (e) => {
        e.preventDefault();
        setSavingBank(true);
        try {
            await updateProfile(bankForm);
            toast.success('Bank details updated');
        } catch (error) {
            toast.error('Failed to update bank details');
        } finally {
            setSavingBank(false);
        }
    };

    const handleInvoiceSubmit = async (e) => {
        e.preventDefault();
        setSavingInvoice(true);
        try {
            await updateProfile(invoiceForm);
            toast.success('Invoice settings updated');
        } catch (error) {
            toast.error('Failed to update settings');
        } finally {
            setSavingInvoice(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setSavingPassword(true);
        try {
            await updatePassword(passwordForm.newPassword);
            setPasswordForm({ newPassword: '', confirmPassword: '' });
            toast.success('Password updated');
        } catch (error) {
            toast.error('Failed to update password');
        } finally {
            setSavingPassword(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            toast.error('Failed to sign out');
        }
    };

    if (loading) {
        return <ContentLoader />;
    }

    const currencyOptions = [
        { value: 'NGN', label: '₦ NGN - Nigerian Naira' },
        { value: 'USD', label: '$ USD - US Dollar' },
        { value: 'EUR', label: '€ EUR - Euro' },
        { value: 'GBP', label: '£ GBP - British Pound' }
    ];

    return (
        <div className="settings-page">
            <header className="settings-header">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">Manage your business profile and preferences</p>
            </header>

            <div className="settings-sections">
                {/* Business Profile */}
                <article className="settings-card settings-card--primary">
                    <header className="settings-card__header">
                        <div className="settings-card__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className="settings-card__title">Business Profile</h2>
                            <p className="settings-card__desc">Company info on invoices</p>
                        </div>
                    </header>
                    <form onSubmit={handleBusinessSubmit}>
                        <div className="settings-card__body">
                            <div className="settings-form-grid">
                                <Input
                                    label="Company Name"
                                    name="company_name"
                                    value={businessForm.company_name}
                                    onChange={handleBusinessChange}
                                    placeholder="Opsyn Technologies"
                                />
                                <Input
                                    label="Tagline"
                                    name="tagline"
                                    value={businessForm.tagline}
                                    onChange={handleBusinessChange}
                                    placeholder="Building the future"
                                />
                                <Input
                                    label="RC Number"
                                    name="rc_number"
                                    value={businessForm.rc_number}
                                    onChange={handleBusinessChange}
                                    placeholder="RC 1234567"
                                />
                                <Input
                                    label="Phone"
                                    name="phone"
                                    value={businessForm.phone}
                                    onChange={handleBusinessChange}
                                    placeholder="+234 800 000 0000"
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={businessForm.email}
                                    onChange={handleBusinessChange}
                                    placeholder="hello@company.com"
                                    className="settings-form-grid--full"
                                />
                                <Textarea
                                    label="Address"
                                    name="address"
                                    value={businessForm.address}
                                    onChange={handleBusinessChange}
                                    rows={2}
                                    className="settings-form-grid--full"
                                    placeholder="123 Business Street, Lagos, Nigeria"
                                />
                            </div>
                        </div>
                        <footer className="settings-card__footer">
                            <Button type="submit" loading={savingBusiness}>Save Changes</Button>
                        </footer>
                    </form>
                </article>

                {/* Bank Account */}
                <article className="settings-card settings-card--success">
                    <header className="settings-card__header">
                        <div className="settings-card__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className="settings-card__title">Bank Account</h2>
                            <p className="settings-card__desc">Payment details for invoices</p>
                        </div>
                    </header>
                    <form onSubmit={handleBankSubmit}>
                        <div className="settings-card__body">
                            <div className="settings-form-grid">
                                <Input
                                    label="Bank Name"
                                    name="bank_name"
                                    value={bankForm.bank_name}
                                    onChange={handleBankChange}
                                    placeholder="GTBank, First Bank..."
                                />
                                <Input
                                    label="Account Name"
                                    name="account_name"
                                    value={bankForm.account_name}
                                    onChange={handleBankChange}
                                    placeholder="Account holder name"
                                />
                                <Input
                                    label="Account Number"
                                    name="account_number"
                                    value={bankForm.account_number}
                                    onChange={handleBankChange}
                                    placeholder="0123456789"
                                    maxLength={10}
                                    className="settings-form-grid--full"
                                />
                                <div className="settings-hint">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 16v-4M12 8h.01"/>
                                    </svg>
                                    <span>Shown on invoices when "Include bank details" is enabled</span>
                                </div>
                            </div>
                        </div>
                        <footer className="settings-card__footer">
                            <Button type="submit" loading={savingBank}>Save Bank Details</Button>
                        </footer>
                    </form>
                </article>

                {/* Invoice Settings */}
                <article className="settings-card settings-card--warning">
                    <header className="settings-card__header">
                        <div className="settings-card__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className="settings-card__title">Invoice Settings</h2>
                            <p className="settings-card__desc">Defaults for new invoices</p>
                        </div>
                    </header>
                    <form onSubmit={handleInvoiceSubmit}>
                        <div className="settings-card__body">
                            <div className="settings-form-grid">
                                <Input
                                    label="Invoice Prefix"
                                    name="invoice_prefix"
                                    value={invoiceForm.invoice_prefix}
                                    onChange={handleInvoiceChange}
                                    placeholder="INV"
                                />
                                <Input
                                    label="Default Due Days"
                                    name="default_due_days"
                                    type="number"
                                    value={invoiceForm.default_due_days}
                                    onChange={handleInvoiceChange}
                                    min="1"
                                />
                                <Select
                                    label="Default Currency"
                                    name="currency"
                                    value={invoiceForm.currency}
                                    onChange={handleInvoiceChange}
                                    options={currencyOptions}
                                    className="settings-form-grid--full"
                                />
                                <Textarea
                                    label="Default Notes"
                                    name="default_notes"
                                    value={invoiceForm.default_notes}
                                    onChange={handleInvoiceChange}
                                    rows={2}
                                    className="settings-form-grid--full"
                                    placeholder="Thank you for your business."
                                />
                            </div>
                        </div>
                        <footer className="settings-card__footer">
                            <Button type="submit" loading={savingInvoice}>Save Changes</Button>
                        </footer>
                    </form>
                </article>

                {/* Change Password */}
                <article className="settings-card settings-card--muted">
                    <header className="settings-card__header">
                        <div className="settings-card__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0110 0v4"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className="settings-card__title">Change Password</h2>
                            <p className="settings-card__desc">Update account password</p>
                        </div>
                    </header>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="settings-card__body">
                            <div className="settings-form-grid">
                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="••••••••"
                                />
                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        <footer className="settings-card__footer">
                            <Button type="submit" loading={savingPassword}>Update Password</Button>
                        </footer>
                    </form>
                </article>

                {/* Sign Out */}
                <article className="settings-card settings-card--danger">
                    <header className="settings-card__header">
                        <div className="settings-card__icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className="settings-card__title">Sign Out</h2>
                            <p className="settings-card__desc">Sign out of your account</p>
                        </div>
                    </header>
                    <div className="settings-card__body">
                        <Button variant="danger" onClick={handleSignOut}>Sign Out</Button>
                    </div>
                </article>
            </div>
        </div>
    );
}