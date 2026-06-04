import { motion } from 'framer-motion';

export default function SectionTitle({ number, title }) {
  return (
    <motion.div
      className="section-title-wrapper"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      {number && <span className="section-number">{number}</span>}
      <h2 className="section-title">{title}</h2>
      <div className="section-line" />
    </motion.div>
  );
}
