import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaDownload, FaEnvelope, FaLinkedin, FaGithub, FaChevronRight } from 'react-icons/fa';
import { profile } from '../data/profileData';
import './Hero.css';

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = profile.roles[roleIndex];
    let timeout;

    if (!isDeleting && text.length < currentRole.length) {
      timeout = setTimeout(() => setText(currentRole.slice(0, text.length + 1)), 80);
    } else if (!isDeleting && text.length === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
    } else if (isDeleting && text.length === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % profile.roles.length);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        <motion.div
          className="hero__content"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="hero__greeting">
            <span className="hero__wave">&#128075;</span>
            <span className="hero__hello">Hello, I'm</span>
          </div>

          <h1 className="hero__name">{profile.name}</h1>

          <div className="hero__typing">
            <span className="hero__typing-prefix">&gt; </span>
            <span className="hero__typing-text">{text}</span>
            <span className="hero__cursor">|</span>
          </div>

          <p className="hero__tagline">{profile.tagline}</p>

          <div className="hero__location">
            <FaMapMarkerAlt />
            <span>{profile.location}</span>
          </div>

          <div className="hero__buttons">
            <a href="#projects" className="neon-btn" onClick={(e) => { e.preventDefault(); document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' }); }}>
              <span>View Projects</span>
              <FaChevronRight />
            </a>
            <a href={profile.cvLink} className="neon-btn neon-btn-secondary" download>
              <FaDownload />
              <span>Download CV</span>
            </a>
            <a href="#contact" className="neon-btn" onClick={(e) => { e.preventDefault(); document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' }); }}>
              <span>Contact Me</span>
            </a>
          </div>

          <div className="hero__social">
            <a href={`mailto:${profile.social.email}`} className="hero__social-link" aria-label="Email">
              <FaEnvelope />
            </a>
            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hero__social-link" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="terminal-card hero__terminal">
            <div className="terminal-header">
              <div className="terminal-dot red" />
              <div className="terminal-dot yellow" />
              <div className="terminal-dot green" />
              <span className="terminal-title">adryan@dev ~ profile</span>
            </div>
            <div className="terminal-body">
              <div className="terminal-line"><span className="t-key">name</span>: <span className="t-str">"Adryan Maha Putra"</span></div>
              <div className="terminal-line"><span className="t-key">role</span>: <span className="t-str">"Full-Stack Developer"</span></div>
              <div className="terminal-line"><span className="t-key">university</span>: <span className="t-str">"UMRI"</span></div>
              <div className="terminal-line"><span className="t-key">gpa</span>: <span className="t-num">3.81</span></div>
              <div className="terminal-line"><span className="t-key">predicate</span>: <span className="t-str">"Cum Laude"</span></div>
              <div className="terminal-line"><span className="t-key">focus</span>: [</div>
              <div className="terminal-line" style={{ paddingLeft: '16px' }}><span className="t-str">"Web"</span>, <span className="t-str">"Mobile"</span>,</div>
              <div className="terminal-line" style={{ paddingLeft: '16px' }}><span className="t-str">"AI/ML"</span>, <span className="t-str">"IoT"</span>,</div>
              <div className="terminal-line" style={{ paddingLeft: '16px' }}><span className="t-str">"Game Dev"</span></div>
              <div className="terminal-line">]</div>
              <div className="terminal-line"><span className="t-key">available</span>: <span className="t-bool">true</span></div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="hero__scroll-indicator">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="hero__scroll-mouse">
            <div className="hero__scroll-dot" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
