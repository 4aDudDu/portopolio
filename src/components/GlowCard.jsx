import { motion } from 'framer-motion';

export default function GlowCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      className={`glow-card ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
