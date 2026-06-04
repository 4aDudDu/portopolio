import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaTimes, FaCheckCircle } from 'react-icons/fa';
import ImageCarousel from './ImageCarousel';

export default function ProjectModal({ project, onClose, images = [] }) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>

          {images.length > 0 && (
            <div style={{ marginBottom: 20, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <ImageCarousel images={images} height={300} />
            </div>
          )}

          <span className="pill-tag pill-tag-purple" style={{ marginBottom: 12 }}>{project.category}</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
            {project.title}
          </h2>
          {project.role && (
            <p style={{ fontSize: '0.88rem', color: 'var(--primary)', marginBottom: 16, fontWeight: 500 }}>
              {project.role}
            </p>
          )}

          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 20 }}>
            {project.description}
          </p>

          {project.features && project.features.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
                Key Features
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {project.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <FaCheckCircle style={{ color: 'var(--primary)', fontSize: '0.75rem', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.achievement && (
            <div style={{
              padding: '12px 16px',
              background: 'var(--primary-dim)',
              border: '1px solid rgba(0,229,255,0.2)',
              borderRadius: 8,
              fontSize: '0.85rem',
              color: 'var(--primary)',
              marginBottom: 20,
            }}>
              ⭐ {project.achievement}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
              Tech Stack
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {project.stack.map(s => (
                <span key={s} className="tech-badge">{s}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="neon-btn" style={{ fontSize: '0.78rem', padding: '10px 20px' }}>
                <FaExternalLinkAlt />
                <span>Live Site</span>
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="neon-btn neon-btn-secondary" style={{ fontSize: '0.78rem', padding: '10px 20px' }}>
                <FaGithub />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
