import { useState, useEffect } from 'react';
import { projects as hardcodedProjects, projectCategories } from '../data/profileData';
import { useProjectImages, useCustomProjects, useProjectLinks } from './AdminPanel';
import SectionTitle from './SectionTitle';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import './Projects.css';

export default function Projects() {
  const [active, setActive] = useState('All');
  const [selected, setSelected] = useState(null);
  const projectImages = useProjectImages();
  const customProjects = useCustomProjects();
  const projectLinks = useProjectLinks();

  const allProjects = [...hardcodedProjects, ...customProjects].map(p => {
    const edits = projectLinks[String(p.id)];
    if (edits) {
      return { ...p, link: edits.link || p.link, github: edits.github || p.github };
    }
    return p;
  });

  const filtered = active === 'All'
    ? allProjects
    : allProjects.filter(p => p.category === active || p.category.includes(active));

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionTitle number="05" title="Projects" />

        <div className="projects__filters">
          {projectCategories.map(cat => (
            <button
              key={cat}
              className={`projects__filter ${active === cat ? 'projects__filter--active' : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
              {cat !== 'All' && (
                <span className="projects__filter-count">
                  {allProjects.filter(p => p.category === cat || p.category.includes(cat)).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="projects__grid">
          {filtered.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              onClick={setSelected}
              images={projectImages[String(p.id)] || []}
            />
          ))}
        </div>
      </div>

      {selected && (
        <ProjectModal
          project={selected}
          onClose={() => setSelected(null)}
          images={projectImages[String(selected.id)] || []}
        />
      )}
    </section>
  );
}
