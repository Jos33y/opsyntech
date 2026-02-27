import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../hooks/useInvoices';
import { useProfile } from '../hooks/useProfile';
import { StatCard, RevenueIcon, PendingIcon, PaidIcon, OverdueIcon } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { RecentInvoices } from '../components/dashboard/RecentInvoices';
import { formatCurrency } from '../lib/formatters';

export default function Dashboard() {
    const { profile } = useProfile();
    const { invoices, loading } = useInvoices();
    const [chartPeriod, setChartPeriod] = useState('monthly');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        pendingAmount: 0,
        paidAmount: 0,
        overdueAmount: 0,
        totalCount: 0,
        pendingCount: 0,
        paidCount: 0,
        overdueCount: 0
    });

    // Calculate stats from invoices
    useEffect(() => {
        if (invoices && invoices.length > 0) {
            const calculated = invoices.reduce((acc, inv) => {
                const total = parseFloat(inv.total) || 0;
                acc.totalRevenue += total;
                acc.totalCount++;
                
                switch (inv.status) {
                    case 'paid':
                        acc.paidAmount += total;
                        acc.paidCount++;
                        break;
                    case 'pending':
                        acc.pendingAmount += total;
                        acc.pendingCount++;
                        break;
                    case 'overdue':
                        acc.overdueAmount += total;
                        acc.overdueCount++;
                        break;
                    default:
                        break;
                }
                
                return acc;
            }, {
                totalRevenue: 0,
                pendingAmount: 0,
                paidAmount: 0,
                overdueAmount: 0,
                totalCount: 0,
                pendingCount: 0,
                paidCount: 0,
                overdueCount: 0
            });
            
            setStats(calculated);
        }
    }, [invoices]);

    // Generate chart data based on period
    const chartData = useMemo(() => {
        if (!invoices || invoices.length === 0) {
            if (chartPeriod === 'monthly') {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return months.map(name => ({ name, revenue: 0 }));
            } else {
                const currentYear = new Date().getFullYear();
                const years = [];
                for (let y = currentYear - 4; y <= currentYear; y++) {
                    years.push({ name: y.toString(), revenue: 0 });
                }
                return years;
            }
        }

        if (chartPeriod === 'monthly') {
            // Monthly data for current year
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentYear = new Date().getFullYear();
            const monthlyData = {};
            months.forEach(m => { monthlyData[m] = 0; });

            invoices.forEach(inv => {
                if (inv.status === 'paid' && inv.invoice_date) {
                    const date = new Date(inv.invoice_date);
                    if (date.getFullYear() === currentYear) {
                        const monthName = months[date.getMonth()];
                        monthlyData[monthName] += parseFloat(inv.total) || 0;
                    }
                }
            });

            return months.map(name => ({ name, revenue: monthlyData[name] }));
        } else {
            // Yearly data (last 5 years)
            const currentYear = new Date().getFullYear();
            const yearlyData = {};
            for (let y = currentYear - 4; y <= currentYear; y++) {
                yearlyData[y] = 0;
            }

            invoices.forEach(inv => {
                if (inv.status === 'paid' && inv.invoice_date) {
                    const year = new Date(inv.invoice_date).getFullYear();
                    if (yearlyData.hasOwnProperty(year)) {
                        yearlyData[year] += parseFloat(inv.total) || 0;
                    }
                }
            });

            return Object.keys(yearlyData).map(year => ({
                name: year,
                revenue: yearlyData[year]
            }));
        }
    }, [invoices, chartPeriod]);

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // Get user's first name from business name or email
    const getUserName = () => {
        if (profile?.business_name) {
            return profile.business_name.split(' ')[0];
        }
        return null;
    };

    // Get current date formatted
    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-NG', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="dashboard">
                <div className="dashboard__loading">
                    <div className="dashboard__loading-header">
                        <div className="skeleton skeleton--title"></div>
                        <div className="skeleton skeleton--text"></div>
                    </div>
                    <div className="stats-grid">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="skeleton skeleton--card"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const userName = getUserName();

    return (
        <div className="dashboard">
            {/* Welcome Header */}
            <header className="dashboard__header">
                <div className="dashboard__welcome">
                    <h1 className="dashboard__title">
                        {getGreeting()}{userName ? `, ${userName}` : ''}
                    </h1>
                    <p className="dashboard__subtitle">{getCurrentDate()}</p>
                </div>
                <div className="dashboard__actions">
                    <Link to="/invoices/new" className="btn btn--primary btn--with-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>New Invoice</span>
                    </Link>
                </div>
            </header>

            {/* Stats Overview */}
            <section className="dashboard__stats">
                <div className="stats-grid">
                    <StatCard
                        label="Total Invoiced"
                        value={formatCurrency(stats.totalRevenue)}
                        subtitle={`${stats.totalCount} invoice${stats.totalCount !== 1 ? 's' : ''}`}
                        icon={<RevenueIcon />}
                        accent="default"
                    />
                    <StatCard
                        label="Pending"
                        value={formatCurrency(stats.pendingAmount)}
                        subtitle={`${stats.pendingCount} invoice${stats.pendingCount !== 1 ? 's' : ''}`}
                        icon={<PendingIcon />}
                        accent="warning"
                    />
                    <StatCard
                        label="Paid"
                        value={formatCurrency(stats.paidAmount)}
                        subtitle={`${stats.paidCount} invoice${stats.paidCount !== 1 ? 's' : ''}`}
                        icon={<PaidIcon />}
                        accent="success"
                    />
                    <StatCard
                        label="Overdue"
                        value={formatCurrency(stats.overdueAmount)}
                        subtitle={`${stats.overdueCount} invoice${stats.overdueCount !== 1 ? 's' : ''}`}
                        icon={<OverdueIcon />}
                        accent="error"
                    />
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="dashboard__content">
                <div className="dashboard__main">
                    <RevenueChart 
                        data={chartData} 
                        onPeriodChange={setChartPeriod}
                    />
                </div>
                <div className="dashboard__aside">
                    <RecentInvoices invoices={invoices} />
                </div>
            </section>
        </div>
    );
}