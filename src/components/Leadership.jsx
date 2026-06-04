import { motion } from 'framer-motion';
import { FaCrown, FaUsers } from 'react-icons/fa';
import { leadership } from '../data/profileData';
import SectionTitle from './SectionTitle';
import GlowCard from './GlowCard';
import './Leadership.css';

export default function Leadership() {
  return (
    <section id="leadership" className="section">
      <div className="container">
        <SectionTitle number="07" title="Leadership & Organization" />
        <div className="leader__timeline">
          <div className="leader__line" />
          {leadership.map((l, i) => (
            <motion.div
              className="leader__item"
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="leader__dot">
                {i === 0 ? <FaCrown /> : <FaUsers />}
              </div>
              <div className="glow-card leader__card">
                <h3 className="leader__title">{l.title}</h3>
                <p className="leader__org">{l.organization}</p>
                <p className="leader__period">{l.period}</p>
                <p className="leader__desc">{l.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
