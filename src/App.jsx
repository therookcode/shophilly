import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

// --- 3D Components ---

const FloatingObject = ({ position, color, speed, distort, radius }) => {
    const mesh = useRef();

    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.getElapsedTime();
        const mX = state.mouse.x * 2;
        const mY = state.mouse.y * 2;

        mesh.current.position.y = position[1] + Math.sin(t * speed) * 0.5 + mY * 0.2;
        mesh.current.position.x = position[0] + mX * 0.2;
        mesh.current.rotation.x = Math.cos(t / 4) / 2 + mY * 0.1;
        mesh.current.rotation.y = Math.sin(t / 4) / 2 + mX * 0.1;
        mesh.current.rotation.z = Math.sin(t / 4) / 2;
    });

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={mesh} position={position}>
                <Sphere args={[radius, 64, 64]}>
                    <MeshDistortMaterial
                        color={color}
                        speed={speed * 2}
                        distort={distort}
                        radius={radius}
                    />
                </Sphere>
            </mesh>
        </Float>
    );
};

const BackgroundScene = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />

            {/* Decorative Floating Elements */}
            <FloatingObject position={[-5, 2, 0]} color="#bc6c25" speed={1.5} distort={0.4} radius={1.2} />
            <FloatingObject position={[6, -3, -2]} color="#D4AF37" speed={2} distort={0.5} radius={0.8} />
            <FloatingObject position={[-3, -4, 2]} color="#1b4332" speed={1} distort={0.3} radius={1} />
            <FloatingObject position={[4, 4, -4]} color="#fefae0" speed={2.5} distort={0.6} radius={0.5} />

            <Environment preset="city" />
            <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={20} blur={24} far={10} />
        </>
    );
};

// --- Web UI Components ---

const ProductCard = ({ name, price, image, rating, region }) => (
    <motion.div
        className="glass"
        whileHover={{ y: -15, scale: 1.02 }}
        style={{
            padding: '1.5rem',
            borderRadius: '24px',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'left',
            position: 'relative'
        }}
    >
        <div style={{
            position: 'absolute',
            top: '2.5rem',
            right: '2.5rem',
            background: 'rgba(212, 175, 55, 0.9)',
            color: '#081c15',
            padding: '4px 12px',
            borderRadius: '100px',
            fontSize: '0.7rem',
            fontWeight: '800',
            letterSpacing: '1px',
            zIndex: 10
        }}>
            {region}
        </div>
        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '240px', marginBottom: '1.5rem' }}>
            <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{name}</h3>
                <p style={{ color: 'var(--color-gold)', fontWeight: '700', fontSize: '1.1rem' }}>{price}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={14} fill="#D4AF37" color="#D4AF37" />
                <span style={{ fontSize: '0.9rem' }}>{rating}</span>
            </div>
        </div>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem' }}>
            <button className="btn-primary" style={{ flex: 1, padding: '0.8rem' }}>Add to Bag</button>
            <button style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
                <Heart size={20} />
            </button>
        </div>
    </motion.div>
);

const App = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const products = [
        { name: 'Muga Silk Tapestry', price: '₹12,499', image: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&w=800&q=80', rating: '4.9', region: 'ASSAM' },
        { name: 'Raw Kauna Basket', price: '₹1,299', image: 'https://images.unsplash.com/photo-1541944743827-e04aa6427c33?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', rating: '4.8', region: 'MANIPUR' },
        { name: 'Pure Bamboo Flute', price: '₹899', image: 'https://images.unsplash.com/photo-1590732823181-f561b6397395?auto=format&fit=crop&w=800&q=80', rating: '4.7', region: 'TRIPURA' },
        { name: 'Wild Hill Honey', price: '₹750', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80', rating: '5.0', region: 'MIZORAM' },
        { name: 'Heritage Naga Shawl', price: '₹5,600', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc183f08?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', rating: '4.9', region: 'NAGALAND' },
        { name: 'Black Stone Pottery', price: '₹2,100', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80', rating: '4.8', region: 'MEGHALAYA' },
    ];

    return (
        <div className="app">
            {/* Scroll Progress Indicator */}
            <motion.div
                className="scroll-progress"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'var(--color-gold)',
                    zIndex: 2000,
                    scaleX,
                    transformOrigin: '0%'
                }}
            />

            {/* 3D Background */}
            <div className="canvas-container">
                <Canvas shadows dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <BackgroundScene />
                    </Suspense>
                </Canvas>
            </div>

            {/* Navigation */}
            <nav className={isScrolled ? 'scrolled' : ''}>
                <motion.div
                    className="logo"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    SHOPHILLY
                </motion.div>
                <div className="nav-links">
                    {['Discover', 'Market', 'Story'].map((item) => (
                        <motion.a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            whileHover={{ color: 'var(--color-gold)', y: -2 }}
                        >
                            {item}
                        </motion.a>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <motion.div whileHover={{ scale: 1.1 }}>
                        <ShoppingBag size={24} color={isScrolled ? 'white' : '#D4AF37'} cursor="pointer" />
                    </motion.div>
                    <button className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Get Started</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="discover" className="hero" style={{ background: 'transparent', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', pointerEvents: 'none' }}>
                <div className="hero-content content-overlay" style={{ maxWidth: '900px', textAlign: 'center', margin: '0 auto' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{ fontSize: '6rem', lineHeight: '1', marginBottom: '2rem' }}
                    >
                        Regional Excellence, <br />
                        <span style={{ color: 'var(--color-gold)' }}>Without Borders.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.8 }}
                    >
                        A curated ecosystem for the finest crafts and flavors of the North East. <br />
                        Diversity unified into one premium marketplace.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '1.2rem 3rem', pointerEvents: 'auto' }}>
                            Explore the Collection
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Marketplace Section */}
            <section id="market" style={{ background: 'transparent', padding: '10rem 5%' }}>
                <div className="section-title content-overlay" style={{ color: 'white', marginBottom: '6rem' }}>
                    <h2 style={{ color: 'white', fontSize: '4rem' }}>The Unified Collection</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.7 }}>Handcrafted by masters. Chosen for the discerning.</p>
                </div>
                <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
                    {products.map((product, index) => (
                        <ProductCard key={index} {...product} />
                    ))}
                </div>
            </section>

            {/* Story Section */}
            <section id="story" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <div className="glass content-overlay" style={{ padding: '5rem', borderRadius: '40px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '2rem' }}>Our Unified Vision</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                            Shophilly isn't just about products; it's about preserving a way of life. By removing geographical and mental boundaries, we celebrate the collective brilliance of the Seven Sisters as one powerful cultural force.
                        </p>
                        <div style={{ display: 'flex', gap: '3rem' }}>
                            <div>
                                <h4 style={{ color: 'var(--color-gold)', fontSize: '2rem' }}>2,400+</h4>
                                <p style={{ color: 'white' }}>Global Deliveries</p>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--color-gold)', fontSize: '2rem' }}>100%</h4>
                                <p style={{ color: 'white' }}>Artisan Equity</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ position: 'relative', height: '100%' }}>
                        <img
                            src="https://images.unsplash.com/photo-1541944743827-e04aa6427c33?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            alt="Artisan"
                            style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '24px' }}
                        />
                    </div>
                </div>
            </section>

            <footer style={{ background: '#081c15', padding: '8rem 5% 3rem' }}>
                <div className="footer-content" style={{ color: 'white' }}>
                    <div>
                        <div className="logo" style={{ marginBottom: '2rem' }}>SHOPHILLY</div>
                        <p style={{ opacity: 0.6 }}>Redefining regional accessibility through technology and design.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        <div>
                            <h4 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem' }}>Discover</h4>
                            <ul style={{ listStyle: 'none', opacity: 0.6 }}>
                                <li>Collections</li>
                                <li>Artisan Stories</li>
                                <li>Our Process</li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem' }}>Support</h4>
                            <ul style={{ listStyle: 'none', opacity: 0.6 }}>
                                <li>Shipping</li>
                                <li>Returns</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', opacity: 0.6 }}>
                                <li>Terms</li>
                                <li>Privacy</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0.4 }}>
                    &copy; 2026 SHOPHILLY INC. ALL RIGHTS RESERVED.
                </div>
            </footer>
        </div>
    );
};

export default App;
