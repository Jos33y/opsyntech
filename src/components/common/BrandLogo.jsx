/**
 * OPSYN Technologies Brand Logo
 * Structure: Power-O + PSYN + Underline + TECHNOLOGIES
 * Always left-aligned, underline spans full OPSYN width
 */

export function BrandLogo({ size = 'md', showTagline = true, className = '' }) {
    const sizes = {
        sm: {
            powerO: 24,
            strokeWidth: 3,
            barWidth: 3,
            barHeight: 9,
            barTop: 3,
            fontSize: 20,
            letterSpacing: 4,
            underlineHeight: 3,
            taglineSize: 8,
            taglineSpacing: 2,
            gap: 6
        },
        md: {
            powerO: 32,
            strokeWidth: 4,
            barWidth: 4,
            barHeight: 12,
            barTop: 4,
            fontSize: 28,
            letterSpacing: 5,
            underlineHeight: 4,
            taglineSize: 10,
            taglineSpacing: 3,
            gap: 8
        },
        lg: {
            powerO: 42,
            strokeWidth: 5,
            barWidth: 5,
            barHeight: 16,
            barTop: 5,
            fontSize: 36,
            letterSpacing: 6,
            underlineHeight: 5,
            taglineSize: 13,
            taglineSpacing: 4,
            gap: 10
        }
    };

    const s = sizes[size] || sizes.md;

    return (
        <div className={`brand-logo brand-logo--${size} ${className}`}>
            <div className="brand-logo__main">
                {/* Power-O */}
                <div 
                    className="brand-logo__power-o"
                    style={{
                        width: s.powerO,
                        height: s.powerO,
                        borderWidth: s.strokeWidth
                    }}
                >
                    <span 
                        className="brand-logo__power-bar"
                        style={{
                            width: s.barWidth,
                            height: s.barHeight,
                            top: s.barTop
                        }}
                    />
                </div>
                {/* PSYN */}
                <span 
                    className="brand-logo__text"
                    style={{
                        fontSize: s.fontSize,
                        letterSpacing: s.letterSpacing
                    }}
                >
                    PSYN
                </span>
            </div>
            {/* Underline - spans full width */}
            <div 
                className="brand-logo__underline"
                style={{
                    height: s.underlineHeight,
                    marginTop: s.gap
                }}
            />
            {/* TECHNOLOGIES tagline */}
            {showTagline && (
                <span 
                    className="brand-logo__tagline"
                    style={{
                        fontSize: s.taglineSize,
                        letterSpacing: s.taglineSpacing,
                        marginTop: s.gap
                    }}
                >
                    TECHNOLOGIES
                </span>
            )}
        </div>
    );
}