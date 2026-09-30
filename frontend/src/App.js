import React, { useState, useEffect } from 'react';
import './index.css';

const ROLES = [
  'Full Stack Web Developer',
  'Data Science & ML Enthusiast',
  'CSE (Data Science) Student',
  'Python & MERN Developer'
];

function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeFilter, setActiveFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Image error handling to support profile.jpg, pranathi_passport_white_bg.png or fallback
  const [imageIndex, setImageIndex] = useState(0);
  const profileImages = [
    `${process.env.PUBLIC_URL}/pranathi_profile.png`,
    `${process.env.PUBLIC_URL}/profile.jpg`,
    `${process.env.PUBLIC_URL}/profile.png`
  ];

  // Dynamic Typed Text
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track Scroll Progress & Active Section (Projects right after Hero)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      const sectionIds = ['hero', 'projects', 'education', 'skills', 'experience', 'achievements', 'contact'];
      for (const sId of sectionIds) {
        const el = document.getElementById(sId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4) {
            setActiveSection(sId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic Role Typing Effect
  useEffect(() => {
    const currentRole = ROLES[currentRoleIndex];
    let typingSpeed = isDeleting ? 30 : 75;

    if (!isDeleting && displayedText === currentRole) {
      typingSpeed = 2200;
      const timer = setTimeout(() => setIsDeleting(true), typingSpeed);
      return () => clearTimeout(timer);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
      typingSpeed = 200;
    }

    const timer = setTimeout(() => {
      setDisplayedText((prev) =>
        isDeleting
          ? currentRole.substring(0, prev.length - 1)
          : currentRole.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentRoleIndex]);

  // Copy Email to Clipboard with Toast Notification
  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('yarnagulapranathi@gmail.com');
    showToast('Email copied to clipboard: yarnagulapranathi@gmail.com');
  };

  // Copy Phone to Clipboard
  const copyPhoneToClipboard = () => {
    navigator.clipboard.writeText('+918688498007');
    showToast('Phone number copied to clipboard: +91 8688498007');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Determine endpoint: on production uses /api/contact; locally falls back to local backend port 5001
      let endpoint = '/api/contact';
      let response;
      
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } catch (e) {
        // If relative /api/contact fails in local dev, try local Express port 5001
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          endpoint = 'http://localhost:5001/api/contact';
          response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
        } else {
          throw e;
        }
      }

      // If response is HTML (CRA fallback), try localhost:5001
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json') && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        endpoint = 'http://localhost:5001/api/contact';
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();

      if (response.ok && data.success !== false) {
        showToast('Thank you! Your message has been sent directly to Pranathi.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        showToast(data.error || 'Failed to deliver message. Please email directly.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      showToast('Note: Make sure backend server is running, or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // The 3 Projects with Deployed Links & GitHub Repositories
  const allProjects = [
    {
      id: 1,
      title: 'LearnLoop — Educational Web Platform',
      category: 'Web Development',
      badgeText: '24-HR HACKATHON PROJECT',
      description: 'Full-stack gamified learning platform with interactive quizzes, learning streaks, and live leaderboards built in a 24-hour hackathon.',
      impact: 'Earned official Certificate of Achievement for Hackathon project.',
      tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB'],
      demoLink: 'https://pranathi1127.github.io/LearnLoop/',
      codeLink: 'https://github.com/Charan-718/LearnLoop',
      features: [
        'Gamified quizzes with instant score calculations',
        'Daily user streak counters to boost retention',
        'Real-time leaderboards with MongoDB backend'
      ]
    },
    {
      id: 2,
      title: 'Extinct Species Prediction System (ExtinctEra)',
      category: 'Machine Learning',
      badgeText: 'MACHINE LEARNING & FLASK',
      description: 'Machine learning web application to predict extinct animal species and prehistoric habitats using classification models.',
      impact: 'Integrated predictive ML models with interactive Flask web endpoints.',
      tags: ['Python', 'Flask', 'Scikit-learn', 'Pandas', 'Bootstrap'],
      demoLink: 'https://pranathi1127.github.io/Extinct-Species-ML/dino_landing_page.html',
      codeLink: 'https://github.com/pranathi1127/Extinct-Species-ML',
      features: [
        'Predictive species classification using Scikit-learn',
        'Prehistoric habitat correlation & visualization',
        'Responsive Bootstrap UI with Flask REST API'
      ]
    },
    {
      id: 3,
      title: 'Study Desk — Interactive AI Study Assistant',
      category: 'AI & Next-Gen',
      badgeText: 'GENAI & REACT + VITE',
      description: 'AI study assistant converting notes into validated study packs with automated flashcards, quizzes, and spaced-repetition re-tests.',
      impact: 'High-speed Groq API LLM inference with React + TypeScript UI.',
      tags: ['React', 'TypeScript', 'Vite', 'Groq API', 'Express.js'],
      demoLink: 'https://flam-assignment-e9d9.onrender.com/',
      codeLink: 'https://github.com/pranathi1127/Study-Desk',
      features: [
        'Automated note-to-flashcard generation via Groq LLM',
        'Interactive quiz generator with accuracy tracking',
        'Spaced-repetition missed-answer re-test engine'
      ]
    }
  ];

  const filteredProjects = activeFilter === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter);

  // Technical Skills from LaTeX Resume
  const skillCategories = [
    {
      category: 'Programming & Languages',
      icon: 'fa-solid fa-terminal',
      skills: ['Python', 'JavaScript (ES6+)', 'TypeScript', 'HTML5 & CSS3']
    },
    {
      category: 'Machine Learning & Data Science',
      icon: 'fa-solid fa-brain',
      skills: ['Scikit-learn', 'NumPy', 'Pandas', 'Matplotlib', 'Data Analysis']
    },
    {
      category: 'Web Development & Frameworks',
      icon: 'fa-solid fa-code',
      skills: ['MERN Stack', 'React', 'Node.js', 'Express.js', 'Flask', 'Bootstrap', 'Vite']
    },
    {
      category: 'Databases & Storage',
      icon: 'fa-solid fa-database',
      skills: ['SQL', 'MongoDB', 'Database Schema Design']
    },
    {
      category: 'Tools & Platforms',
      icon: 'fa-solid fa-screwdriver-wrench',
      skills: ['Git', 'GitHub', 'VS Code', 'Groq API']
    },
    {
      category: 'Computer Science Fundamentals',
      icon: 'fa-solid fa-network-wired',
      skills: ['Data Structures & Algorithms', 'Cloud Basics', 'DBMS', 'Object-Oriented Programming (OOP)', 'Operating Systems (OS)']
    }
  ];

  // Internships from LaTeX Resume
  const internships = [
    {
      id: 1,
      period: 'July 2025 — Sep 2025',
      role: 'Python Full Stack Development Intern',
      organization: 'AICTE Virtual Internship',
      type: 'Virtual Internship',
      highlights: [
        'Completed comprehensive industry training in Python Full Stack Development, covering both frontend architectures and backend design.',
        'Developed end-to-end web applications implementing Python, HTML, CSS, and JavaScript.'
      ]
    },
    {
      id: 2,
      period: 'Virtual Job Simulation',
      role: 'Data Analytics Intern',
      organization: 'Deloitte | via Forage',
      type: 'Job Simulation',
      highlights: [
        'Analyzed complex datasets to derive strategic, data-driven insights using core data analytics techniques.',
        'Simulated corporate consulting workflows and applied forensic data analysis concepts to evaluate operational scenarios.'
      ]
    },
    {
      id: 3,
      period: 'Jun 2026 — Jul 2026',
      role: 'Full Stack Development Intern',
      organization: 'Thiranex Skill Development & Future Tech',
      type: 'Internship',
      highlights: [
        'Completed Full Stack Development internship focused on engineering responsive and user-friendly web applications.',
        'Worked hands-on with HTML, CSS, JavaScript, and modern backend integration concepts.'
      ]
    }
  ];

  // Certifications from LaTeX Resume
  const certifications = [
    {
      title: 'Python Full Stack Development',
      issuer: 'AICTE Virtual Internship',
      icon: 'fa-solid fa-certificate',
      desc: 'Completed training covering full-stack web concepts with Python, backend development, and responsive frontend UI.'
    },
    {
      title: 'The Joy of Computing using Python',
      issuer: 'NPTEL',
      icon: 'fa-solid fa-award',
      desc: 'Rigorous national certification program focusing on core Python algorithms, problem solving, and computational thinking.'
    },
    {
      title: 'LearnLoop Hackathon Project Certificate',
      issuer: 'Hackathon Award',
      icon: 'fa-solid fa-trophy',
      desc: 'Recognized for engineering the LearnLoop full-stack educational web platform with streaks and leaderboards in a 24-hr hackathon.'
    },
    {
      title: 'Generative AI Essentials',
      issuer: 'TCS iON Career Edge',
      icon: 'fa-solid fa-brain',
      desc: 'Focused credential covering foundational Generative AI principles, LLMs, and real-world AI applications.'
    }
  ];

  // Achievements from LaTeX Resume
  const achievements = [
    {
      title: 'Flipkart GRiD 8.0 Qualifier',
      tag: 'Competition Milestone',
      icon: 'fa-solid fa-bolt',
      desc: 'Qualified Round 2 in Flipkart GRiD 8.0, one of India’s premier national engineering and technology flagship competitions.'
    },
    {
      title: 'Selected for Infosys Springboard',
      tag: 'Selection Honor',
      icon: 'fa-solid fa-star',
      desc: 'Selected for the prestigious Infosys Springboard Virtual Internship Program for technical proficiency and potential.'
    },
    {
      title: 'Outstanding Academic Record (9.28 CGPA)',
      tag: 'Academic Excellence',
      icon: 'fa-solid fa-graduation-cap',
      desc: 'Maintained a strong 9.28 / 10 CGPA in B.Tech Computer Science and Engineering (Data Science) at Raghu Engineering College.'
    },
    {
      title: 'LeetCode Problem Solver',
      tag: 'DSA & Algorithms',
      icon: 'fa-solid fa-code',
      desc: 'Consistently practicing algorithms and data structures on LeetCode (@pranathii_1127) across Python & problem solving.'
    }
  ];

  // Navigation Links (Projects placed right after Home!)
  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Internships' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="portfolio-app">
      {/* Scroll Progress Bar at Top */}
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* Clean Navbar */}
      <header className="header-nav">
        <div className="container">
          <div className="nav-container">
            <button
              onClick={() => scrollToSection('hero')}
              className="logo-brand"
              aria-label="Poorna Pranathi Yarnagula Portfolio"
            >
              <div className="logo-badge" title="Poorna Pranathi — Software Engineer">
                <svg
                  className="logo-woman-icon"
                  viewBox="0 0 122.88 119.08"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M29.86,66.76a21.3,21.3,0,0,1-10-6.3c6.7-2.52,9.79-10.44,10.22-22.28.32-8.8-1.51-11.56,1.49-20.25C37.51.74,59.49-5.14,71.74,4.92,81.33,3.9,91,8.85,93.1,23.65c1.55,11.06-1.75,18,1.73,28.17a15.87,15.87,0,0,0,8.19,9.7c-2.62,2.5-6.4,4.15-11,5.26-3.51.86-9.86,1.52-17.25,1.91v5.19L82,83.49,61.43,99.86,40.87,83.63l5.49-9.22V68.84c-7.17-.34-13.24-1-16.5-2.08Zm62,25A71.82,71.82,0,0,0,80,74.83c33.21,12.85,33.47,9,42.91,44.25H0c9.42-35.2,9.7-31.41,42.91-44.25A71.82,71.82,0,0,0,31,91.75l9.22-.23,20.73,16.55L82.67,91.52l9.23.23Z"
                  />
                </svg>
              </div>
              <div className="logo-text">
                Pranathi<span className="logo-dot">.</span>
              </div>
            </button>

            <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`nav-item-link ${activeSection === item.id ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="nav-actions">
              <a
                href="https://github.com/pranathi1127"
                target="_blank"
                rel="noreferrer"
                className="btn-outline-sm"
                title="GitHub Profile"
              >
                <i className="fa-brands fa-github"></i>
                <span className="hide-on-mobile">GitHub</span>
              </a>

              <button
                className="mobile-toggle-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                <i className={mobileMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* ==========================================================================
            1. HERO SECTION (Poorna Pranathi Yarnagula Profile)
            ========================================================================== */}
        <section id="hero" className="section-hero">
          <div className="container">
            <div className="hero-grid">
              {/* Left Column: Bio & Value Proposition */}
              <div className="hero-content">
                <div className="status-pill">
                  <span className="status-dot"></span>
                  <span className="status-text">Open to Tech Internships & Software Engineering Roles</span>
                </div>

                <h1 className="hero-title">
                  Poorna Pranathi <span className="hero-name-highlight">Yarnagula</span>
                </h1>

                <div className="hero-typed-role">
                  <span className="role-prefix">I am a</span>
                  <span className="role-text">{displayedText}</span>
                  <span className="role-cursor">|</span>
                </div>

                <p className="hero-summary">
                  Computer Science & Engineering (Data Science) undergraduate at <strong>Raghu Engineering College</strong> with a <strong>9.28 CGPA</strong>. 
                  Passionate about engineering full-stack web applications with Python & MERN, developing predictive Machine Learning systems, and solving algorithmic problems.
                </p>

                {/* Key Impact Metrics Strip */}
                <div className="hero-metrics-strip">
                  <div className="metric-item">
                    <span className="metric-value">9.28</span>
                    <span className="metric-label">CGPA / 10</span>
                  </div>
                  <div className="metric-divider"></div>
                  <div className="metric-item">
                    <span className="metric-value">3+</span>
                    <span className="metric-label">Core Projects</span>
                  </div>
                  <div className="metric-divider"></div>
                  <div className="metric-item">
                    <span className="metric-value">Round 2</span>
                    <span className="metric-label">Flipkart GRiD 8.0</span>
                  </div>
                  <div className="metric-divider"></div>
                  <div className="metric-item">
                    <span className="metric-value">Infosys</span>
                    <span className="metric-label">Springboard Selected</span>
                  </div>
                </div>

                {/* Hero CTAs */}
                <div className="hero-actions">
                  <button onClick={() => scrollToSection('projects')} className="btn-primary">
                    <span>View Projects</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>

                  <a
                    href="https://leetcode.com/u/pranathii_1127/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                  >
                    <i className="fa-solid fa-code"></i>
                    <span>LeetCode Profile</span>
                  </a>

                  <button onClick={copyEmailToClipboard} className="btn-outline" title="Copy Email">
                    <i className="fa-regular fa-copy"></i>
                    <span>Copy Email</span>
                  </button>
                </div>

                {/* Direct Social & Technical Links */}
                <div className="hero-social-links">
                  <span className="social-label">Connect:</span>
                  <a href="https://github.com/pranathi1127" target="_blank" rel="noreferrer" className="social-link" title="GitHub (pranathi1127)">
                    <i className="fa-brands fa-github"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/pranathiyarnagula" target="_blank" rel="noreferrer" className="social-link" title="LinkedIn (pranathiyarnagula)">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a href="https://leetcode.com/u/pranathii_1127/" target="_blank" rel="noreferrer" className="social-link" title="LeetCode (pranathii_1127)">
                    <i className="fa-solid fa-terminal"></i>
                  </a>
                  <a href="mailto:yarnagulapranathi@gmail.com" className="social-link" title="Email (yarnagulapranathi@gmail.com)">
                    <i className="fa-regular fa-envelope"></i>
                  </a>
                </div>
              </div>

              {/* Right Column: Hero Photo Container */}
              <div className="hero-media">
                <div className="photo-frame-container">
                  <div className="photo-card">
                    {/* Portrait Image with Dynamic Fallback */}
                    {imageIndex < profileImages.length ? (
                      <img
                        src={profileImages[imageIndex]}
                        alt="Poorna Pranathi Yarnagula"
                        className="hero-profile-image"
                        onError={() => setImageIndex((prev) => prev + 1)}
                      />
                    ) : (
                      <div className="photo-placeholder-fallback">
                        <div className="placeholder-avatar">
                          <i className="fa-solid fa-user-graduate"></i>
                        </div>
                        <p className="placeholder-text">Poorna Pranathi Yarnagula</p>
                        <span className="placeholder-subtext">CSE (Data Science) • 9.28 CGPA</span>
                      </div>
                    )}

                    {/* Overlay Info Card */}
                    <div className="photo-badge-overlay">
                      <div className="photo-badge-dot"></div>
                      <div>
                        <div className="photo-badge-title">Poorna Pranathi Yarnagula</div>
                        <div className="photo-badge-subtitle">B.Tech CSE (Data Science) • Raghu Engg College</div>
                      </div>
                    </div>

                    {/* Floating Exp Pill */}
                    <div className="floating-exp-tag">
                      <i className="fa-solid fa-award"></i>
                      <span>CGPA: 9.28 / 10</span>
                    </div>
                  </div>

                  {/* Clean Background Frame Accent */}
                  <div className="photo-frame-backdrop"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            2. FEATURED PROJECTS SECTION (RIGHT UNDER HERO)
            ========================================================================== */}
        <section id="projects" className="section-block section-alt">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Featured Work</span>
              <h2 className="section-title">Core Engineered Projects</h2>
              <p className="section-desc">
                Production-ready web applications, machine learning systems, and generative AI tools with live deployments.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="filter-tab-bar">
              {['All', 'Web Development', 'Machine Learning', 'AI & Next-Gen'].map((cat) => (
                <button
                  key={cat}
                  className={`filter-tab-btn ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* The 3 Featured Projects Grid */}
            <div className="projects-grid">
              {filteredProjects.map((proj) => (
                <div key={proj.id} className="project-card">
                  <div className="project-card-header">
                    <span className="project-badge">{proj.badgeText}</span>
                    <span className="project-category-label">{proj.category}</span>
                  </div>

                  <div className="project-card-body">
                    <h3 className="project-title">{proj.title}</h3>
                    <p className="project-desc">{proj.description}</p>

                    {proj.impact && (
                      <div className="project-impact-box">
                        <i className="fa-solid fa-award"></i>
                        <span>{proj.impact}</span>
                      </div>
                    )}

                    {proj.features && (
                      <ul className="project-feature-list">
                        {proj.features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <i className="fa-solid fa-circle-dot"></i>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="project-tags-wrap">
                      {proj.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="project-tech-tag">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="project-card-footer">
                    <a
                      href={proj.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link-primary"
                    >
                      <span>Live Demo</span>
                      <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <a
                      href={proj.codeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link-secondary"
                    >
                      <i className="fa-brands fa-github"></i>
                      <span>Source Code</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            3. EDUCATION SECTION (From LaTeX Resume)
            ========================================================================== */}
        <section id="education" className="section-block">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Academic Background</span>
              <h2 className="section-title">Education & Foundation</h2>
              <p className="section-desc">
                Strong theoretical knowledge and academic excellence in Computer Science and Data Science.
              </p>
            </div>

            <div className="education-card-wrapper">
              <div className="education-main-card">
                <div className="education-header">
                  <div className="edu-icon-badge">
                    <i className="fa-solid fa-graduation-cap"></i>
                  </div>
                  <div className="edu-header-text">
                    <h3 className="edu-degree">B.Tech in Computer Science and Engineering (Data Science)</h3>
                    <div className="edu-college">Raghu Engineering College, Visakhapatnam</div>
                  </div>
                  <div className="edu-meta-badge">
                    <span className="edu-period">2023 — 2027</span>
                    <span className="edu-cgpa-pill">
                      <i className="fa-solid fa-star"></i> CGPA: 9.28 / 10
                    </span>
                  </div>
                </div>

                <div className="edu-details-body">
                  <h4 className="edu-subheading">Core Academic & Technical Disciplines:</h4>
                  <div className="edu-tags-grid">
                    <span className="edu-tag"><i className="fa-solid fa-check"></i> Data Structures & Algorithms (DSA)</span>
                    <span className="edu-tag"><i className="fa-solid fa-check"></i> Database Management Systems (DBMS)</span>
                    <span className="edu-tag"><i className="fa-solid fa-check"></i> Object-Oriented Programming (OOP)</span>
                    <span className="edu-tag"><i className="fa-solid fa-check"></i> Operating Systems (OS)</span>
                    <span className="edu-tag"><i className="fa-solid fa-check"></i> Cloud Computing Basics</span>
                    <span className="edu-tag"><i className="fa-solid fa-check"></i> Machine Learning & Data Science</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            4. TECHNICAL SKILLS SECTION (From LaTeX Resume)
            ========================================================================== */}
        <section id="skills" className="section-block section-alt">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Technical Competencies</span>
              <h2 className="section-title">Skills & Technologies</h2>
              <p className="section-desc">
                Organized toolkit spanning core programming, data science, web development, and fundamentals.
              </p>
            </div>

            <div className="skills-categorized-grid">
              {skillCategories.map((group, gIdx) => (
                <div key={gIdx} className="skill-category-card">
                  <div className="category-header">
                    <div className="category-icon">
                      <i className={group.icon}></i>
                    </div>
                    <h3 className="category-title">{group.category}</h3>
                  </div>

                  <div className="skill-tags-list">
                    {group.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="skill-pill-item">
                        <i className="fa-solid fa-check"></i>
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            5. INTERNSHIPS & PROFESSIONAL EXPERIENCE (From LaTeX)
            ========================================================================== */}
        <section id="experience" className="section-block">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Industry Experience</span>
              <h2 className="section-title">Internships & Simulations</h2>
              <p className="section-desc">
                Applied development and corporate simulation experience across full-stack and analytics domains.
              </p>
            </div>

            <div className="timeline-container">
              {internships.map((exp) => (
                <div key={exp.id} className="timeline-card">
                  <div className="timeline-meta">
                    <span className="timeline-period">{exp.period}</span>
                    <span className="timeline-type-badge">{exp.type}</span>
                  </div>

                  <div className="timeline-content">
                    <div className="timeline-header-row">
                      <h3 className="timeline-role">{exp.role}</h3>
                      <span className="timeline-company">{exp.organization}</span>
                    </div>

                    <ul className="timeline-bullets">
                      {exp.highlights.map((bullet, bIdx) => (
                        <li key={bIdx} className="timeline-bullet-item">
                          <i className="fa-solid fa-circle-check"></i>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            6. ACHIEVEMENTS & CERTIFICATIONS (From LaTeX)
            ========================================================================== */}
        <section id="achievements" className="section-block section-alt">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Recognition & Credentials</span>
              <h2 className="section-title">Achievements & Certifications</h2>
              <p className="section-desc">
                Key competitive milestones, academic recognition, and verified technical credentials.
              </p>
            </div>

            {/* Achievements Grid */}
            <h3 className="sub-section-title">
              <i className="fa-solid fa-trophy"></i> Key Achievements
            </h3>
            <div className="achievements-grid">
              {achievements.map((ach, aIdx) => (
                <div key={aIdx} className="achievement-card">
                  <div className="achievement-icon-wrap">
                    <i className={ach.icon}></i>
                  </div>
                  <div>
                    <span className="achievement-tag">{ach.tag}</span>
                    <h4 className="achievement-title">{ach.title}</h4>
                    <p className="achievement-desc">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications Grid */}
            <h3 className="sub-section-title" style={{ marginTop: '3rem' }}>
              <i className="fa-solid fa-file-shield"></i> Verified Certifications
            </h3>
            <div className="certifications-grid">
              {certifications.map((cert, cIdx) => (
                <div key={cIdx} className="cert-card">
                  <div className="cert-header">
                    <div className="cert-icon">
                      <i className={cert.icon}></i>
                    </div>
                    <div>
                      <h4 className="cert-title">{cert.title}</h4>
                      <span className="cert-issuer">{cert.issuer}</span>
                    </div>
                  </div>
                  <p className="cert-desc">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            7. CONTACT SECTION (From LaTeX Resume Details)
            ========================================================================== */}
        <section id="contact" className="section-block">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Contact Pranathi</span>
              <h2 className="section-title">Let's Connect & Collaborate</h2>
              <p className="section-desc">
                Feel free to reach out directly for internships, collaborative projects, or career opportunities.
              </p>
            </div>

            <div className="contact-grid">
              {/* Left Contact Info */}
              <div className="contact-info-panel">
                <div className="contact-card">
                  <div className="contact-card-icon">
                    <i className="fa-regular fa-envelope"></i>
                  </div>
                  <div>
                    <div className="contact-card-label">Email Address</div>
                    <div className="contact-card-value">yarnagulapranathi@gmail.com</div>
                    <button onClick={copyEmailToClipboard} className="btn-copy-inline">
                      <i className="fa-regular fa-copy"></i>
                      <span>Click to copy email</span>
                    </button>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <div className="contact-card-label">Contact Number</div>
                    <div className="contact-card-value">+91 8688498007</div>
                    <button onClick={copyPhoneToClipboard} className="btn-copy-inline">
                      <i className="fa-regular fa-copy"></i>
                      <span>Click to copy phone</span>
                    </button>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <div className="contact-card-label">Location</div>
                    <div className="contact-card-value">Rajahmundry, Andhra Pradesh, 533105</div>
                    <div className="contact-card-sub">India • Open to Relocation & Remote Roles</div>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon">
                    <i className="fa-solid fa-globe"></i>
                  </div>
                  <div>
                    <div className="contact-card-label">Profiles & Coding Platforms</div>
                    <div className="social-pill-row">
                      <a href="https://www.linkedin.com/in/pranathiyarnagula" target="_blank" rel="noreferrer" className="contact-social-pill">
                        <i className="fa-brands fa-linkedin-in"></i>
                        <span>LinkedIn</span>
                      </a>
                      <a href="https://github.com/pranathi1127" target="_blank" rel="noreferrer" className="contact-social-pill">
                        <i className="fa-brands fa-github"></i>
                        <span>GitHub</span>
                      </a>
                      <a href="https://leetcode.com/u/pranathii_1127/" target="_blank" rel="noreferrer" className="contact-social-pill">
                        <i className="fa-solid fa-terminal"></i>
                        <span>LeetCode</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Contact Form */}
              <div className="contact-form-panel">
                <form onSubmit={handleFormSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Your Name <span className="req">*</span></label>
                      <input
                        id="name"
                        type="text"
                        required
                        placeholder="e.g. Hiring Manager / Recruiter"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Your Email <span className="req">*</span></label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="e.g. recruiter@company.com"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="e.g. Software Engineering Opportunity / Internship"
                      className="form-control"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-group-message">
                    <label className="form-label" htmlFor="message">Message <span className="req">*</span></label>
                    <textarea
                      id="message"
                      required
                      rows="4"
                      placeholder="Hi Pranathi, we would like to discuss an opportunity regarding your background in Python & Full Stack development..."
                      className="form-control textarea"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span>Sending...</span>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <i className="fa-solid fa-paper-plane"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==========================================================================
          FOOTER
          ========================================================================== */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-flex">
            <div className="footer-left">
              <div className="footer-logo">Poorna Pranathi Yarnagula<span>.</span></div>
              <p className="footer-tagline">B.Tech CSE (Data Science) • Raghu Engineering College</p>
            </div>

            <div className="footer-links">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="footer-nav-link"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="footer-copy">
              © {new Date().getFullYear()} Poorna Pranathi Yarnagula.
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <i className="fa-solid fa-circle-check"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
