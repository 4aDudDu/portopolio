import { motion } from 'framer-motion';
import { FaServer, FaMobileAlt, FaBrain, FaMicrochip, FaGamepad, FaShieldAlt } from 'react-icons/fa';
import { profile } from '../data/profileData';
import SectionTitle from './SectionTitle';
import './About.css';

const iconMap = { FaServer, FaMobileAlt, FaBrain, FaMicrochip, FaGamepad, FaShieldAlt };

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionTitle number="01" title="About Me" />

        <motion.div
          className="about__text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p>{profile.about}</p>
        </motion.div>

        <div className="about__grid">
          {profile.highlights.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                className="about__card glow-card"
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="about__card-icon">
                  {Icon && <Icon />}
                </div>
                <h3 className="about__card-title">{item.title}</h3>
                <p className="about__card-desc">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
