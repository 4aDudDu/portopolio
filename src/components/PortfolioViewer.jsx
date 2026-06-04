import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaFileAlt, FaExpand, FaCompress } from 'react-icons/fa';
import { profile } from '../data/profileData';
import SectionTitle from './SectionTitle';
import './PortfolioViewer.css';

export default function PortfolioViewer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="portfolio-deck" className="section">
      <div className="container">
        <SectionTitle number="// showcase" title="Portfolio Deck" />

        <motion.div
          className="pv__wrapper"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="pv__header">
            <div className="pv__header-left">
              <FaFileAlt className="pv__header-icon" />
              <div>
                <h3 className="pv__header-title">Portfolio Presentation</h3>
                <p className="pv__header-sub">Slide through my complete portfolio deck</p>
              </div>
            </div>
            <div className="pv__header-actions">
              <button
                className="pv__action-btn"
                onClick={() => setExpanded(!expanded)}
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <FaCompress /> : <FaExpand />}
                <span>{expanded ? 'Collapse' : 'Expand'}</span>
              </button>
              <a href={profile.portfolioLink} download className="pv__action-btn pv__action-btn--primary">
                <FaDownload />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          <div className={`pv__embed ${expanded ? 'pv__embed--expanded' : ''}`}>
            <iframe
              src={`${profile.portfolioLink}#toolbar=0&navpanes=0`}
              className="pv__iframe"
              title="Portfolio Presentation"
            />
          </div>

          <div className="pv__footer">
            <span className="pv__footer-hint">
              💡 Use scroll or arrow keys to navigate slides • Click expand for full view
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
