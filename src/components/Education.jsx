import { motion } from 'framer-motion';
import { FaGraduationCap, FaTrophy } from 'react-icons/fa';
import { education } from '../data/profileData';
import SectionTitle from './SectionTitle';
import './Education.css';

export default function Education() {
  const edu = education[0];
  return (
    <section id="education" className="section">
      <div className="container">
        <SectionTitle number="02" title="Education" />

        <motion.div
          className="edu__timeline"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="edu__line" />
          <div className="edu__dot">
            <FaGraduationCap />
          </div>

          <div className="edu__card glow-card">
            <div className="edu__header">
              <h3 className="edu__degree">{edu.degree}</h3>
              <p className="edu__institution">{edu.institution}</p>
              <p className="edu__period">{edu.period}</p>
            </div>

            <div className="edu__badges">
              {edu.badges.map(b => (
                <span key={b} className="pill-tag">{b}</span>
              ))}
            </div>

            <div className="edu__stats">
              <div className="edu__stat">
                <span className="edu__stat-label">GPA</span>
                <span className="edu__stat-value">{edu.gpa}</span>
              </div>
              <div className="edu__stat">
                <span className="edu__stat-label">Predicate</span>
                <span className="edu__stat-value">{edu.predicate}</span>
              </div>
              <div className="edu__stat">
                <span className="edu__stat-label">Duration</span>
                <span className="edu__stat-value">{edu.duration}</span>
              </div>
            </div>

            <div className="edu__thesis">
              <h4 className="edu__thesis-label">
                <FaTrophy style={{ color: 'var(--primary)', marginRight: 8 }} />
                Thesis
              </h4>
              <p className="edu__thesis-text">{edu.thesis}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
