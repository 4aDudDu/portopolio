import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import './ImageCarousel.css';

export default function ImageCarousel({ images = [], height = 200 }) {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!images || images.length === 0) return null;

  const next = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prev = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="carousel" style={{ height }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt={`Slide ${current + 1}`}
            className="carousel__img"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            draggable={false}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button className="carousel__arrow carousel__arrow--left" onClick={prev} aria-label="Previous">
              <FaChevronLeft />
            </button>
            <button className="carousel__arrow carousel__arrow--right" onClick={next} aria-label="Next">
              <FaChevronRight />
            </button>
          </>
        )}

        <button
          className="carousel__fullscreen"
          onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
          aria-label="Fullscreen"
        >
          <FaExpand />
        </button>

        {images.length > 1 && (
          <div className="carousel__dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel__dot ${i === current ? 'carousel__dot--active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        <span className="carousel__counter">{current + 1}/{images.length}</span>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="carousel__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            <motion.img
              src={images[current]}
              alt={`Slide ${current + 1}`}
              className="carousel__overlay-img"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <>
                <button className="carousel__overlay-arrow carousel__overlay-arrow--left" onClick={prev}>
                  <FaChevronLeft />
                </button>
                <button className="carousel__overlay-arrow carousel__overlay-arrow--right" onClick={next}>
                  <FaChevronRight />
                </button>
              </>
            )}
            <div className="carousel__overlay-dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`carousel__dot ${i === current ? 'carousel__dot--active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
