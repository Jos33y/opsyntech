import { Input } from '../common/Input';
import { formatCurrency } from '../../lib/formatters';

export function LineItemRow({ item, index, onChange, onRemove, canRemove = true }) {
    const handleChange = (field, value) => {
        const newItem = { ...item, [field]: value };
        
        if (field === 'quantity' || field === 'unit_price') {
            const qty = parseFloat(field === 'quantity' ? value : item.quantity) || 0;
            const price = parseFloat(field === 'unit_price' ? value : item.unit_price) || 0;
            newItem.total = qty * price;
        }
        
        onChange(index, newItem);
    };

    return (
        <div className="line-item">
            <div className="line-item__field">
                <span className="line-item__label">Description</span>
                <Input
                    placeholder="Service description"
                    value={item.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            </div>
            <div className="line-item__field">
                <span className="line-item__label">Qty</span>
                <Input
                    type="number"
                    placeholder="1"
                    value={item.quantity || ''}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    min="0"
                    step="1"
                />
            </div>
            <div className="line-item__field">
                <span className="line-item__label">Unit Price</span>
                <Input
                    type="number"
                    placeholder="0.00"
                    value={item.unit_price || ''}
                    onChange={(e) => handleChange('unit_price', e.target.value)}
                    min="0"
                    step="0.01"
                />
            </div>
            <div className="line-item__field">
                <span className="line-item__label">Total</span>
                <div className="line-item__total">
                    {formatCurrency(item.total || 0)}
                </div>
            </div>
            {canRemove && (
                <button
                    type="button"
                    className="line-item__remove"
                    onClick={() => onRemove(index)}
                    aria-label="Remove item"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            )}
        </div>
    );
}