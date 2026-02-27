export function Input({
    label,
    error,
    type = 'text',
    id,
    name,
    value,
    onChange,
    placeholder,
    disabled = false,
    required = false,
    className = '',
    ...props
}) {
    const inputId = id || name;

    return (
        <div className={'input-group ' + className}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <input
                type={type}
                id={inputId}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={'input' + (error ? ' input-error' : '')}
                {...props}
            />
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
}

export function Textarea({
    label,
    error,
    id,
    name,
    value,
    onChange,
    placeholder,
    disabled = false,
    required = false,
    rows = 3,
    className = '',
    ...props
}) {
    const inputId = id || name;

    return (
        <div className={'input-group ' + className}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <textarea
                id={inputId}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                rows={rows}
                className={'input input-textarea' + (error ? ' input-error' : '')}
                {...props}
            />
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
}

export function Select({
    label,
    error,
    id,
    name,
    value,
    onChange,
    options = [],
    placeholder,
    disabled = false,
    required = false,
    className = '',
    ...props
}) {
    const inputId = id || name;

    return (
        <div className={'input-group ' + className}>
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}
            <select
                id={inputId}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={'input input-select' + (error ? ' input-error' : '')}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="input-error-text">{error}</span>}
        </div>
    );
}