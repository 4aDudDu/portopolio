import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import ImageCarousel from './ImageCarousel';
import './ProjectCard.css';

export default function ProjectCard({ project, index, onClick, images = [] }) {
  return (
    <motion.div
      className="project-card glow-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={() => onClick(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(project)}
    >
      <div className="project-card__image">
        {images.length > 0 ? (
          <ImageCarousel images={images} height={160} />
        ) : (
          <div className="project-card__placeholder">
            <span className="project-card__placeholder-icon">&lt;/&gt;</span>
            <span className="project-card__placeholder-cat">{project.category}</span>
          </div>
        )}
      </div>

      <div className="project-card__body">
        <span className="pill-tag pill-tag-purple">{project.category}</span>
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>

        <div className="project-card__stack">
          {project.stack.slice(0, 4).map(s => (
            <span key={s} className="tech-badge">{s}</span>
          ))}
          {project.stack.length > 4 && (
            <span className="tech-badge">+{project.stack.length - 4}</span>
          )}
        </div>

        <div className="project-card__actions">
          <button className="project-card__btn">View Details</button>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-card__link" onClick={(e) => e.stopPropagation()}>
              <FaExternalLinkAlt />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-card__link" onClick={(e) => e.stopPropagation()}>
              <FaGithub />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
