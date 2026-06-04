import { FaHeart, FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { profile } from '../data/profileData';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">
            <span style={{ color: 'var(--primary)' }}>&lt;</span>
            {profile.logo}
            <span style={{ color: 'var(--primary)' }}> /&gt;</span>
          </span>
          <p className="footer__tagline">Building the future, one line at a time.</p>
        </div>

        <div className="footer__social">
          <a href={`mailto:${profile.social.email}`} className="footer__link" aria-label="Email"><FaEnvelope /></a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="footer__link" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="footer__link" aria-label="GitHub"><FaGithub /></a>
        </div>

        <p className="footer__copy">
          © {new Date().getFullYear()} {profile.name}. Crafted with <FaHeart style={{ color: 'var(--primary)', verticalAlign: 'middle' }} /> and code.
        </p>
      </div>
    </footer>
  );
}
