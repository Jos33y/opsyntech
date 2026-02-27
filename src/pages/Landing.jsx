import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/common/BrandLogo';

export default function Landing() {
    return (
        <div className="land">
            {/* Nav */}
            <nav className="land-nav">
                <Link to="/" className="land-nav__brand">
                    <BrandLogo size="sm" showTagline={true} />
                </Link>
                <Link to="/login" className="land-nav__admin">Admin Portal</Link>
            </nav>

            {/* Hero - Bold and Direct */}
            <header className="land-hero">
                <div className="land-hero__inner">
                    <div className="land-hero__content">
                        <div className="land-hero__tag">
                            <span className="land-hero__tag-dot"></span>
                            Automobile & Electronics
                        </div>
                        <h1 className="land-hero__title">
                            We install.<br/>
                            We maintain.<br/>
                            <span>We deliver.</span>
                        </h1>
                        <p className="land-hero__desc">
                            From car trackers to solar systems. 
                            10+ years serving businesses and homes across Nigeria.
                        </p>
                        <div className="land-hero__ctas">
                            <a href="#services" className="land-cta land-cta--primary">See What We Do</a>
                            <a href="#contact" className="land-cta land-cta--secondary">Talk to Us</a>
                        </div>
                    </div>
                    <div className="land-hero__visual">
                        <div className="land-hero__badge land-hero__badge--top">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-1.6-3.2C16 6.3 15.5 6 15 6H9c-.5 0-1 .3-1.4.8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                                <circle cx="7" cy="17" r="2"/>
                                <circle cx="17" cy="17" r="2"/>
                            </svg>
                            <div>
                                <strong>Automobile</strong>
                                <span>Trackers, Stereos, Alarms</span>
                            </div>
                        </div>
                        <div className="land-hero__badge land-hero__badge--bottom">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                            </svg>
                            <div>
                                <strong>Electrical</strong>
                                <span>Solar, CCTV, Fencing</span>
                            </div>
                        </div>
                        <div className="land-hero__ring"></div>
                    </div>
                </div>
            </header>

            {/* Numbers Strip */}
            <section className="land-numbers">
                <div className="land-number">
                    <span className="land-number__val">10+</span>
                    <span className="land-number__lab">Years</span>
                </div>
                <div className="land-number">
                    <span className="land-number__val">100+</span>
                    <span className="land-number__lab">Projects</span>
                </div>
                <div className="land-number">
                    <span className="land-number__val">100%</span>
                    <span className="land-number__lab">Guaranteed</span>
                </div>
            </section>

            {/* Services */}
            <section className="land-services" id="services">
                <div className="land-services__head">
                    <h2>What We Do</h2>
                </div>
                
                <div className="land-services__wrap">
                    {/* Auto */}
                    <article className="land-svc">
                        <div className="land-svc__num">01</div>
                        <div className="land-svc__body">
                            <h3>Automobile</h3>
                            <p>Vehicle sales and professional installations for all car types and models.</p>
                            <ul>
                                <li>GPS Trackers</li>
                                <li>Sound and Android Stereo Systems</li>
                                <li>Remote and Keyless Systems</li>
                                <li>Central Locking Mechanisms</li>
                                <li>Alarms and Sirens</li>
                                <li>Vehicle Upgrades</li>
                            </ul>
                        </div>
                    </article>

                    {/* Electrical */}
                    <article className="land-svc land-svc--alt">
                        <div className="land-svc__num">02</div>
                        <div className="land-svc__body">
                            <h3>Electrical</h3>
                            <p>Complete electrical solutions for homes, offices, and commercial properties.</p>
                            <ul>
                                <li>Solar and Inverter Systems</li>
                                <li>Electric Fencing</li>
                                <li>CCTV Installation</li>
                                <li>Satellite TV</li>
                                <li>Intercom Systems</li>
                                <li>TV Networking</li>
                            </ul>
                        </div>
                    </article>
                </div>
            </section>

            {/* Contact */}
            <section className="land-contact" id="contact">
                <div className="land-contact__card">
                    <div className="land-contact__left">
                        <span className="land-contact__label">Get Started</span>
                        <h2>Have a project?</h2>
                        <p>We would love to hear about it.</p>
                    </div>
                    <div className="land-contact__right">
                        <a href="tel:+2348164320557" className="land-contact__link">
                            <div className="land-contact__link-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                                </svg>
                            </div>
                            <div>
                                <strong>Call Us</strong>
                                <span>Talk to our team directly</span>
                            </div>
                        </a>
                        <a href="mailto:opsyntechnologies@gmail.com" className="land-contact__link">
                            <div className="land-contact__link-icon land-contact__link-icon--alt">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                                    <path d="M22 6l-10 7L2 6"/>
                                </svg>
                            </div>
                            <div>
                                <strong>Email Us</strong>
                                <span>Get a response within 24hrs</span>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="land-footer">
                <div className="land-footer__inner">
                    <div className="land-footer__brand">
                        <BrandLogo size="sm" showTagline={true} />
                    </div>
                    <div className="land-footer__tagline">Quality Service Delivery Guaranteed</div>
                    <div className="land-footer__bottom">
                        <span>© {new Date().getFullYear()} OPSYN Technologies</span>
                        <span className="land-footer__dot"></span>
                        <a href="https://thebrickdev.com" target="_blank" rel="noopener noreferrer">
                            Built by The Brick Dev
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}