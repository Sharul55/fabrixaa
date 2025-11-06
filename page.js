'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const COUNTRIES = [
  { name: 'Afghanistan', code: 'AF', phone: '+93' },
  { name: 'Albania', code: 'AL', phone: '+355' },
  { name: 'Bangladesh', code: 'BD', phone: '+880' },
  { name: 'Brazil', code: 'BR', phone: '+55' },
  { name: 'Canada', code: 'CA', phone: '+1' },
  { name: 'China', code: 'CN', phone: '+86' },
  { name: 'France', code: 'FR', phone: '+33' },
  { name: 'Germany', code: 'DE', phone: '+49' },
  { name: 'India', code: 'IN', phone: '+91' },
  { name: 'Japan', code: 'JP', phone: '+81' },
  { name: 'United Kingdom', code: 'GB', phone: '+44' },
  { name: 'United States', code: 'US', phone: '+1' },
];

export default function LandingPage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ REAL-TIME STATS STATE
  const [stats, setStats] = useState({
    manufacturers: 0,
    buyers: 0,
    products: 0,
    countries: 25
  });

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    companyName: '', address: '', phone: '', country: ''
  });

  // ✅ FETCH REAL-TIME STATS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.data) {
            setStats({
              manufacturers: data.data.manufacturers || 0,
              buyers: data.data.buyers || 0,
              products: data.data.products || 0,
              countries: data.data.countries || 25
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback default values
        setStats({
          manufacturers: 500,
          buyers: 1200,
          products: 5000,
          countries: 25
        });
      }
    };

    // প্রথম বার load হওয়ার সময়
    fetchStats();

    // ✅ REAL-TIME UPDATE - প্রতি ৫ সেকেন্ডে refresh হবে
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Premium Effects (same as before)
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'premium-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'premium-cursor-dot';
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX - 6 + 'px';
      cursorDot.style.top = mouseY - 6 + 'px';

      if (Math.random() > 0.85) {
        createBubble(mouseX, mouseY);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches[0]) {
        const touch = e.touches[0];
        mouseX = touch.clientX;
        mouseY = touch.clientY;

        if (Math.random() > 0.82) {
          createBubble(mouseX, mouseY);
        }
      }
    };

    const createBubble = (x, y) => {
      const bubble = document.createElement('div');
      bubble.className = 'premium-bubble';
      const size = Math.random() * 14 + 4;
      const colors = ['#C9A961', '#5FA6A6', '#D4A5A5', '#f4e5b8', '#7ec5c5', '#4A7C6B', '#E8D9C8'];

      bubble.style.width = size + 'px';
      bubble.style.height = size + 'px';
      bubble.style.left = x - size / 2 + 'px';
      bubble.style.top = y - size / 2 + 'px';
      bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
      bubble.style.opacity = '0.7';

      document.body.appendChild(bubble);
      setTimeout(() => bubble.remove(), 2000);
    };

    const handleClick = (e) => {
      const blastCount = 18;
      for (let i = 0; i < blastCount; i++) {
        createBlast(e.clientX, e.clientY, i, blastCount);
      }
    };

    const handleTouchEnd = (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const touch = e.changedTouches[0];
        const blastCount = 18;
        for (let i = 0; i < blastCount; i++) {
          createBlast(touch.clientX, touch.clientY, i, blastCount);
        }
      }
    };

    const createBlast = (x, y, index, total) => {
      const particle = document.createElement('div');
      particle.className = 'premium-blast-particle';
      const size = Math.random() * 8 + 4;
      const colors = ['#C9A961', '#5FA6A6', '#D4A5A5', '#f4e5b8', '#7ec5c5', '#4A7C6B', '#E8D9C8', '#FFC107'];

      const selectedColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = selectedColor;

      const angle = (Math.PI * 2 * index) / total;
      const velocity = Math.random() * 100 + 80;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    };

    const updateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.12;
      cursorY += (mouseY - cursorY) * 0.12;
      cursor.style.left = cursorX - 15 + 'px';
      cursor.style.top = cursorY - 15 + 'px';
      requestAnimationFrame(updateCursor);
    };
    updateCursor();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchend', handleTouchEnd);
      cursor.remove();
      cursorDot.remove();
    };
  }, []);

  useEffect(() => {
    if (showLoginModal || showSignupModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showLoginModal, showSignupModal]);

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
    setShowLoginModal(true);
    setShowMobileMenu(false);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (data.success) {
        const { user, token } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setTimeout(() => {
          if (user.role === 'buyer') {
            router.push('/buyer/dashboard');
          } else if (user.role === 'manufacturer') {
            router.push('/manufacturer/dashboard');
          }
        }, 300);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };
const handleSignup = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  if (signupForm.password !== signupForm.confirmPassword) {
    setError('Passwords do not match!');
    return;
  }

  if (signupForm.password.length < 6) {
    setError('Password must be at least 6 characters!');
    return;
  }

  setLoading(true);

  try {
    // ✅ FIXED - Changed from /api/auth/login to /api/auth/signup
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        companyName: signupForm.companyName,
        country: signupForm.country,
        phone: signupForm.phone,
        address: signupForm.address,
        role: selectedUserType
      })
    });

    const data = await response.json();

    if (data.success) {
      const { user, token } = data;

      if (user.role === 'manufacturer' && !user.isApproved) {
        setSuccess('✅ Account created! Your account is pending admin approval.');

        setTimeout(() => {
          setShowSignupModal(false);
          setShowLoginModal(true);
          setSuccess('');
        }, 3000);

        setSignupForm({
          name: '', email: '', password: '', confirmPassword: '',
          companyName: '', address: '', phone: '', country: ''
        });
      } else {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setTimeout(() => {
          if (user.role === 'buyer') {
            router.push('/buyer/dashboard');
          } else if (user.role === 'manufacturer') {
            router.push('/manufacturer/dashboard');
          }
        }, 300);
      }
    } else {
      setError(data.message || 'Signup failed');
    }
  } catch (err) {
    setError(err.message || 'Signup failed');
  } finally {
    setLoading(false);
  }
};


  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setSelectedUserType('');
    setError('');
    setSuccess('');
    setLoginForm({ email: '', password: '' });
    setSignupForm({
      name: '', email: '', password: '', confirmPassword: '',
      companyName: '', address: '', phone: '', country: ''
    });
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
    setError('');
    setSuccess('');
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
    setError('');
    setSuccess('');
  };

  return (
    <div className="App">
      {/* ✅ NAVBAR */}
      <nav className="premium-nav">
        <div className="nav-container">
          <div className="logo-section">
            <img src="/logo.jpeg" alt="FabriXaa" className="logo-img" onError={(e) => { e.target.style.display = 'none'; }} />
            <span className="logo-text">FabriXaa</span>
          </div>

          <button
            className={`mobile-menu-btn ${showMobileMenu ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {showMobileMenu && (
            <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}></div>
          )}

          <ul className={`nav-links ${showMobileMenu ? 'active' : ''}`}>
            <li><a href="#home" onClick={() => setShowMobileMenu(false)}>Home</a></li>
            <li><a href="#about" onClick={() => setShowMobileMenu(false)}>About</a></li>
            <li><a href="#services" onClick={() => setShowMobileMenu(false)}>Services</a></li>
            <li><a href="#contact" onClick={() => setShowMobileMenu(false)}>Contact</a></li>
            <li>
              <button className="btn-get-started" onClick={() => { setShowMobileMenu(false); handleUserTypeSelect('buyer'); }}>
                Get Started
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ✅ HERO SECTION */}
      <section id="home" className="premium-hero">
        <div className="hero-bg-overlay"></div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Connect with Top<br />
              <span className="gradient-text">Garments Manufacturers</span>
            </h1>
            <p className="hero-subtitle">
              FabriXaa is Bangladesh's premier B2B marketplace connecting garment manufacturers with global buyers. Post your products, manage orders, and grow your business seamlessly.
            </p>
            <div className="hero-buttons">
              <button className="btn-hero-primary" onClick={() => handleUserTypeSelect('manufacturer')}>
                Join as Manufacturer
              </button>
              <button className="btn-hero-secondary" onClick={() => handleUserTypeSelect('buyer')}>
                Join as Buyer
              </button>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop"
                alt="Garments"
                className="hero-img"
                onError={(e) => { e.target.src = '/placeholder.png'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ STATS SECTION - REAL-TIME DATA */}
      <section id="about" className="premium-stats">
        <div className="stats-container">
          <h2 className="section-title">Why Choose FabriXaa?</h2>
          <p className="section-subtitle">
            Join thousands of manufacturers and buyers in the fastest growing garments marketplace
          </p>
          <div className="stats-grid">
            {[
              { number: `${stats.manufacturers.toLocaleString()}+`, label: 'Manufacturers' },
              { number: `${stats.buyers.toLocaleString()}+`, label: 'Active Buyers' },
              { number: `${stats.products.toLocaleString()}+`, label: 'Products Listed' },
              { number: `${stats.countries}+`, label: 'Countries' }
            ].map((stat, idx) => (
              <div key={idx} className="premium-stat-card">
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ FEATURES SECTION */}
      <section id="services" className="premium-features">
        <div className="features-container">
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-subtitle">
            Powerful tools for manufacturers and buyers to connect, collaborate, and grow
          </p>
          <div className="features-grid">
            {[
              { title: 'Product Posting', desc: 'Easily post products with images and descriptions' },
              { title: 'Order Management', desc: 'Manage orders with instant notifications' },
              { title: 'Dashboard', desc: 'Comprehensive analytics and tracking' },
              { title: 'Secure Messaging', desc: 'Direct communication with buyers/sellers' },
              { title: 'Admin Control', desc: 'Powerful platform management tools' },
              { title: 'Analytics', desc: 'Detailed sales trends and metrics' }
            ].map((feature, idx) => (
              <div key={idx} className="premium-feature-card">
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ TEAM SECTION */}
      <section id="contact" className="premium-team">
        <div className="team-container">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">Get in touch with the founders of FabriXaa</p>

          <div className="office-info">
            <h3>FabriXaa Office</h3>
            <h4>Mohammadpur</h4>
            <p>House-107, Road-04 Dream Palace, Bosila, Dhaka-1207, Bangladesh</p>
          </div>

          <div className="team-grid">
            {[
              { name: 'Sharul Bhuiyan', role: 'FOUNDER', img: '/Sharul.JPG', email: 'sharulbhuiyan1@gmail.com' },
              { name: 'Noshin Tabassum Risha', role: 'CO-FOUNDER', img: '/Risha.jpg', email: 'risha@fabrixaa.com' },
              { name: 'Sourav Kumar Nile', role: 'CO-FOUNDER', img: '/sourov.jpg', email: 'nillhowlader2002@gmail.com' }
            ].map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-image-section">
                  <img src={member.img} alt={member.name} onError={(e) => { e.target.src = '/placeholder.png'; }} />
                </div>
                <div className="team-info-section">
                  <h4>{member.name}</h4>
                  <p className="role">{member.role}</p>
                  <button onClick={() => navigator.clipboard.writeText(member.email).then(() => alert(`✨ Email copied: ${member.email}`))}>
                    ✉️ Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ CTA SECTION */}
      <section id="get-started" className="premium-cta">
        <div className="cta-container">
          <h2>Ready to Grow Your Business?</h2>
          <p>Join FabriXaa today and connect with thousands of manufacturers and buyers worldwide</p>
          <div className="cta-cards">
            <div className="premium-cta-card" onClick={() => handleUserTypeSelect('manufacturer')}>
              <h3>Manufacturer Login</h3>
              <p>Post products and manage orders</p>
              <button>Get Started</button>
            </div>
            <div className="premium-cta-card" onClick={() => handleUserTypeSelect('buyer')}>
              <h3>Buyer Login</h3>
              <p>Browse products and place orders</p>
              <button>Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FOOTER */}
      <footer className="premium-footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div>
              <h3>COMPANY</h3>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
              </ul>
            </div>
            <div>
              <h3>SUPPORT</h3>
              <ul>
                <li><a href="#home">Help</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3>RESOURCES</h3>
              <ul>
                <li><a href="#about">Blog</a></li>
                <li><a href="#services">Docs</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-logo">
              <img src="/logo.jpeg" alt="FabriXaa" onError={(e) => { e.target.style.display = 'none'; }} />
              <span>FabriXaa</span>
            </div>
            <p>© 2025 FabriXaa — All Rights Reserved</p>
            <p>Made with ❤️ in Bangladesh</p>
          </div>
        </div>
      </footer>

      {/* ✅ LOGIN MODAL */}
      {showLoginModal && (
        <div className="premium-modal-overlay" onClick={closeModals}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>×</button>
            <h2>Login to FabriXaa</h2>
            <p>Enter your credentials {selectedUserType && `as ${selectedUserType}`}</p>
            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required placeholder="••••••••" />
              </div>
              <div className="forgot-link">
                <a href="#">Forgot Password?</a>
              </div>
              <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
              <p className="switch-link">
                Don't have an account? <a onClick={(e) => { e.preventDefault(); switchToSignup(); }}>Sign Up</a>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ✅ SIGNUP MODAL */}
      {showSignupModal && (
        <div className="premium-modal-overlay" onClick={closeModals}>
          <div className="premium-modal compact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModals}>×</button>
            <h2>Create Account</h2>
            <p>Join as {selectedUserType === 'manufacturer' ? 'Manufacturer' : 'Buyer'}</p>

            {error && <div className="error-box">{error}</div>}
            {success && <div className="success-box">{success}</div>}

            <form onSubmit={handleSignup}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Your Name" value={signupForm.name} onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="your@email.com" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input type="text" placeholder="Your Company" value={signupForm.companyName} onChange={(e) => setSignupForm({ ...signupForm, companyName: e.target.value })} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Country</label>
                  <select value={signupForm.country} onChange={(e) => setSignupForm({ ...signupForm, country: e.target.value })} required>
                    <option value="">Select Country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name} ({country.phone})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+880 1712345677" value={signupForm.phone} onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input type="text" placeholder="Company Address" value={signupForm.address} onChange={(e) => setSignupForm({ ...signupForm, address: e.target.value })} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="••••••••" value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" placeholder="••••••••" value={signupForm.confirmPassword} onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })} required />
                </div>
              </div>

              <button type="submit" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</button>
              <p className="switch-link">
                Already have an account? <a onClick={(e) => { e.preventDefault(); switchToLogin(); }}>Login</a>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
