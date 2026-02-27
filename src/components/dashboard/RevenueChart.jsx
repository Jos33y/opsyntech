import { useState } from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    CartesianGrid,
    Cell
} from 'recharts';
import { formatCurrency } from '../../lib/formatters';

export function RevenueChart({ data = [], onPeriodChange }) {
    const [period, setPeriod] = useState('monthly');
    const [activeIndex, setActiveIndex] = useState(null);

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        onPeriodChange?.(newPeriod);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="chart-tooltip">
                    <div className="chart-tooltip__label">{label}</div>
                    <div className="chart-tooltip__value">{formatCurrency(payload[0].value)}</div>
                </div>
            );
        }
        return null;
    };

    const formatYAxis = (value) => {
        if (value === 0) return '₦0';
        if (value >= 1000000) return '₦' + (value / 1000000).toFixed(1) + 'M';
        if (value >= 1000) return '₦' + (value / 1000).toFixed(0) + 'K';
        return '₦' + value;
    };

    const hasData = data && data.length > 0 && data.some(d => d.revenue > 0);

    return (
        <div className="chart-card">
            <div className="chart-card__header">
                <div className="chart-card__info">
                    <h3 className="chart-card__title">Revenue Overview</h3>
                    <p className="chart-card__subtitle">Track your earnings over time</p>
                </div>
                <div className="chart-toggle">
                    <button
                        className={`chart-toggle__btn${period === 'monthly' ? ' is-active' : ''}`}
                        onClick={() => handlePeriodChange('monthly')}
                    >
                        Monthly
                    </button>
                    <button
                        className={`chart-toggle__btn${period === 'yearly' ? ' is-active' : ''}`}
                        onClick={() => handlePeriodChange('yearly')}
                    >
                        Yearly
                    </button>
                </div>
            </div>
            <div className="chart-card__body">
                {hasData ? (
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart 
                            data={data} 
                            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                            onMouseMove={(state) => {
                                if (state.isTooltipActive) {
                                    setActiveIndex(state.activeTooltipIndex);
                                } else {
                                    setActiveIndex(null);
                                }
                            }}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                vertical={false} 
                                stroke="rgba(255,255,255,0.04)"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#71717A', fontSize: 11, fontWeight: 500 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#71717A', fontSize: 11, fontWeight: 500 }}
                                tickFormatter={formatYAxis}
                                width={60}
                            />
                            <Tooltip 
                                content={<CustomTooltip />}
                                cursor={{ fill: 'rgba(255, 107, 0, 0.04)', radius: 4 }}
                            />
                            <Bar 
                                dataKey="revenue" 
                                radius={[4, 4, 0, 0]}
                                maxBarSize={40}
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`}
                                        fill={index === activeIndex ? '#FF6B00' : 'rgba(255, 107, 0, 0.7)'}
                                        style={{ transition: 'fill 0.15s ease' }}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="chart-empty">
                        <div className="chart-empty__icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M18 20V10M12 20V4M6 20v-6"/>
                            </svg>
                        </div>
                        <p className="chart-empty__text">No revenue data yet</p>
                        <p className="chart-empty__hint">Create and mark invoices as paid to see your revenue chart</p>
                    </div>
                )}
            </div>
        </div>
    );
}