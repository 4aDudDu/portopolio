import { motion } from 'framer-motion';
import { FaFlask, FaLightbulb } from 'react-icons/fa';
import { research } from '../data/profileData';
import SectionTitle from './SectionTitle';
import GlowCard from './GlowCard';
import './Research.css';

export default function Research() {
  return (
    <section id="research" className="section">
      <div className="container">
        <SectionTitle number="06" title="Research & Innovation" />
        <div className="research__grid">
          {research.map((r, i) => (
            <GlowCard key={i} delay={i * 0.1} className="research__card">
              <div className="research__icon">
                <FaFlask />
              </div>
              <h3 className="research__title">{r.title}</h3>
              <p className="research__meta">{r.institution} • {r.year}</p>
              <p className="research__desc">{r.description}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
