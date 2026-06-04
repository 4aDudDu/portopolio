import { motion } from 'framer-motion';
import { FaCertificate, FaTrophy } from 'react-icons/fa';
import { certifications, awards } from '../data/profileData';
import SectionTitle from './SectionTitle';
import './Certifications.css';

export default function Certifications() {
  return (
    <section id="certifications" className="section">
      <div className="container">
        <SectionTitle number="08" title="Certifications & Awards" />

        <div className="certs__section">
          <h3 className="certs__subtitle">
            <FaCertificate style={{ color: 'var(--primary)' }} />
            Certifications
          </h3>
          <div className="certs__grid">
            {certifications.map((c, i) => (
              <motion.div
                className="glow-card cert__card"
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="cert__icon-wrap">
                  <FaCertificate />
                </div>
                <h4 className="cert__title">{c.title}</h4>
                <p className="cert__issuer">{c.issuer}</p>
                <p className="cert__date">{c.date}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="certs__section">
          <h3 className="certs__subtitle">
            <FaTrophy style={{ color: 'var(--accent)' }} />
            Awards & Achievements
          </h3>
          <div className="certs__grid">
            {awards.map((a, i) => (
              <motion.div
                className="glow-card cert__card cert__card--award"
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div className="cert__icon-wrap cert__icon-wrap--award">
                  <FaTrophy />
                </div>
                <h4 className="cert__title">{a.title}</h4>
                <p className="cert__issuer">{a.event}</p>
                <p className="cert__date">{a.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
