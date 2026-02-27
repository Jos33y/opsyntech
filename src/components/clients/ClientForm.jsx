import { useState, useEffect } from 'react';
import { Input, Textarea } from '../common/Input';
import { Button } from '../common/Button';

export function ClientForm({ initialData, onSubmit, onCancel, loading = false }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        company_name: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address: initialData.address || '',
                company_name: initialData.company_name || '',
                notes: initialData.notes || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Client name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(formData);
    };

    return (
        <form className="client-form" onSubmit={handleSubmit}>
            <div className="client-form__grid">
                <Input
                    label="Client Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                />
                <Input
                    label="Company Name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Optional"
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <div className="client-form__full">
                    <Textarea
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                    />
                </div>
                <div className="client-form__full">
                    <Textarea
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Internal notes about this client..."
                        rows={2}
                    />
                </div>
            </div>
            <div className="client-form__actions">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" loading={loading}>
                    {initialData ? 'Update Client' : 'Add Client'}
                </Button>
            </div>
        </form>
    );
}