export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) {
    const classNames = [
        'btn',
        'btn-' + variant,
        'btn-' + size,
        fullWidth ? 'btn-full' : '',
        loading ? 'btn-loading' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <span className="btn-spinner"></span>}
            <span className={'btn-content' + (loading ? ' btn-content-hidden' : '')}>{children}</span>
        </button>
    );
}