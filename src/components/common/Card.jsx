
export function Card({
    children,
    padding = 'md',
    className = '',
    onClick,
    ...props
}) {
    const classNames = [
        'card',
        'card-padding-' + padding,
        onClick ? 'card-clickable' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classNames} onClick={onClick} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return (
        <div className={'card-header ' + className}>
            {children}
        </div>
    );
}

export function CardBody({ children, className = '' }) {
    return (
        <div className={'card-body ' + className}>
            {children}
        </div>
    );
}

export function CardFooter({ children, className = '' }) {
    return (
        <div className={'card-footer ' + className}>
            {children}
        </div>
    );
}
