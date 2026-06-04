import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skills } from '../data/profileData';
import SectionTitle from './SectionTitle';
import './Skills.css';

export default function Skills() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionTitle number="04" title="Technical Skills" />

        <div className="skills__tabs">
          {skills.categories.map((cat, i) => (
            <button
              key={cat.name}
              className={`skills__tab ${i === activeTab ? 'skills__tab--active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              <span className="skills__tab-num">0{i + 1}</span>
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="skills__content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="skills__grid">
              {skills.categories[activeTab].items.map((skill, i) => (
                <motion.div
                  className="skill__item"
                  key={skill.name}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <div className="skill__info">
                    <span className="skill__name">{skill.name}</span>
                    <span className="skill__level">{skill.level}%</span>
                  </div>
                  <div className="skill__bar">
                    <motion.div
                      className="skill__bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
