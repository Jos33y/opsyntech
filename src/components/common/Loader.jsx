// Premium Loader Components - OPSYN Branded

/**
 * Spinner Loader - For buttons and inline loading
 */
export function Loader({ size = 'md', className = '' }) {
    const sizes = {
        xs: 14,
        sm: 18,
        md: 24,
        lg: 32,
        xl: 48
    };
    
    const strokeWidth = size === 'xs' || size === 'sm' ? 3 : 2.5;
    const dimension = sizes[size] || sizes.md;
    
    return (
        <div className={`loader loader-${size} ${className}`}>
            <svg
                width={dimension}
                height={dimension}
                viewBox="0 0 24 24"
                fill="none"
                className="loader-spinner"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeOpacity="0.15"
                />
                <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}

/**
 * Page Loader - Full page loading state (for initial app load ONLY)
 * Use this before Layout renders
 */
export function PageLoader({ message = '' }) {
    return (
        <div className="page-loader">
            <div className="page-loader__content">
                {/* Animated Logo */}
                <div className="page-loader__logo">
                    <svg viewBox="0 0 64 64" className="page-loader__logo-svg">
                        <circle 
                            cx="32" 
                            cy="32" 
                            r="24" 
                            fill="none" 
                            stroke="var(--color-primary)" 
                            strokeWidth="2.5"
                            strokeDasharray="150"
                            className="page-loader__logo-circle"
                        />
                        <rect 
                            x="29" 
                            y="14" 
                            width="6" 
                            height="16" 
                            rx="3" 
                            fill="var(--color-primary)"
                            className="page-loader__logo-bar"
                        />
                    </svg>
                </div>
                
                {/* Progress indicator */}
                <div className="page-loader__progress">
                    <div className="page-loader__progress-bar"></div>
                </div>
                
                {/* Optional message */}
                {message && (
                    <p className="page-loader__message">{message}</p>
                )}
            </div>
        </div>
    );
}

/**
 * Content Loader - For loading states WITHIN the Layout
 * Does not cover sidebar/nav - only the content area
 */
export function ContentLoader({ message = '' }) {
    return (
        <div className="content-loader">
            <div className="content-loader__inner">
                <Loader size="lg" />
                {message && (
                    <p className="content-loader__message">{message}</p>
                )}
            </div>
        </div>
    );
}

/**
 * Inline Loader - For loading states within content
 */
export function InlineLoader({ text = 'Loading...' }) {
    return (
        <div className="inline-loader">
            <Loader size="sm" />
            <span className="inline-loader__text">{text}</span>
        </div>
    );
}

/**
 * Button Loader - Specifically for button loading states
 */
export function ButtonLoader() {
    return <Loader size="sm" className="button-loader" />;
}

/**
 * Skeleton - Content placeholder while loading
 */
export function Skeleton({ 
    width, 
    height, 
    variant = 'default',
    className = '' 
}) {
    const style = {
        width: width || '100%',
        height: height || '20px'
    };

    return (
        <div 
            className={`skeleton skeleton-${variant} ${className}`} 
            style={style}
        />
    );
}

/**
 * Skeleton Text - Multiple lines of skeleton text
 */
export function SkeletonText({ lines = 3, lastLineWidth = '60%' }) {
    return (
        <div className="skeleton-text">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton 
                    key={i}
                    height="14px"
                    width={i === lines - 1 ? lastLineWidth : '100%'}
                    className="skeleton-text__line"
                />
            ))}
        </div>
    );
}

/**
 * Skeleton Card - Card-shaped skeleton for lists
 */
export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-card__header">
                <Skeleton variant="circle" width="40px" height="40px" />
                <div className="skeleton-card__header-text">
                    <Skeleton height="14px" width="120px" />
                    <Skeleton height="12px" width="80px" />
                </div>
            </div>
            <div className="skeleton-card__body">
                <SkeletonText lines={2} />
            </div>
        </div>
    );
}