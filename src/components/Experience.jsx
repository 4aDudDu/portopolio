import { motion } from 'framer-motion';
import { FaBriefcase, FaExternalLinkAlt } from 'react-icons/fa';
import { experiences } from '../data/profileData';
import SectionTitle from './SectionTitle';
import './Experience.css';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionTitle number="03" title="Experience" />

        <div className="exp__timeline">
          <div className="exp__line" />
          {experiences.map((exp, i) => (
            <motion.div
              className="exp__item"
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="exp__dot">
                {exp.current && <span className="exp__dot-pulse" />}
              </div>

              <div className="exp__card glow-card">
                <div className="exp__card-header">
                  <div>
                    <h3 className="exp__title">{exp.title}</h3>
                    <p className="exp__company">{exp.company}</p>
                    {exp.period && <p className="exp__period">{exp.period}</p>}
                  </div>
                  {exp.current && <span className="pill-tag">Active</span>}
                </div>

                <p className="exp__desc">{exp.description}</p>

                <div className="exp__stack">
                  {exp.stack.map(s => (
                    <span key={s} className="tech-badge">{s}</span>
                  ))}
                </div>

                {exp.website && (
                  <a href={`https://${exp.website}`} target="_blank" rel="noopener noreferrer" className="exp__link">
                    <FaExternalLinkAlt /> {exp.website}
                  </a>
                )}

                {exp.focus && <p className="exp__focus"><strong>Focus:</strong> {exp.focus}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
