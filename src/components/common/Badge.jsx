
export function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = ''
}) {
    const classNames = [
        'badge',
        'badge-' + variant,
        'badge-' + size,
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classNames}>
            {children}
        </span>
    );
}
