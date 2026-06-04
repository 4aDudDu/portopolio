import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { profile } from '../data/profileData';
import SectionTitle from './SectionTitle';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [toast, setToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setToast(false), 4000);
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionTitle number="09" title="Get In Touch" />

        <div className="contact__grid">
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="terminal-card">
              <div className="terminal-header">
                <div className="terminal-dot red" />
                <div className="terminal-dot yellow" />
                <div className="terminal-dot green" />
                <span className="terminal-title">contact_info.sh</span>
              </div>
              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="t-key">echo</span> <span className="t-str">"Let's connect!"</span>
                </div>
                <br />
                <div className="contact__item">
                  <FaEnvelope className="contact__icon" />
                  <div>
                    <p className="contact__label">Email</p>
                    <a href={`mailto:${profile.social.email}`} className="contact__value">{profile.social.email}</a>
                  </div>
                </div>
                <div className="contact__item">
                  <FaLinkedin className="contact__icon" />
                  <div>
                    <p className="contact__label">LinkedIn</p>
                    <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="contact__value">Adryan Maha Putra</a>
                  </div>
                </div>
                <div className="contact__item">
                  <FaGithub className="contact__icon" />
                  <div>
                    <p className="contact__label">GitHub</p>
                    <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="contact__value">4aDudDu</a>
                  </div>
                </div>
                <div className="contact__item">
                  <FaMapMarkerAlt className="contact__icon" />
                  <div>
                    <p className="contact__label">Location</p>
                    <p className="contact__value">{profile.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="contact__form glow-card"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="contact__field">
              <label className="contact__field-label">Name</label>
              <input
                type="text"
                className="contact__input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>
            <div className="contact__field">
              <label className="contact__field-label">Email</label>
              <input
                type="email"
                className="contact__input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="contact__field">
              <label className="contact__field-label">Message</label>
              <textarea
                className="contact__input contact__textarea"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project or just say hi..."
                rows={5}
                required
              />
            </div>
            <button type="submit" className="neon-btn" style={{ width: '100%', justifyContent: 'center' }}>
              <FaPaperPlane />
              <span>Send Message</span>
            </button>
          </motion.form>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <FaCheckCircle style={{ color: 'var(--primary)', fontSize: '1.2rem' }} />
            Message sent successfully! (Frontend only)
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
