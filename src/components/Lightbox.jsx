import React, { useEffect, useState } from 'react';
import './Lightbox.css';

const Lightbox = ({ image, onClose, onNext, onPrev, onDownload }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>×</button>
        <button className="lightbox-nav lightbox-prev" onClick={onPrev}>‹</button>
        <button className="lightbox-nav lightbox-next" onClick={onNext}>›</button>
        
        <div className="lightbox-image-container">
          {isLoading && <div className="lightbox-skeleton"></div>}
          <img 
            src={image.url} 
            alt={image.title}
            onLoad={() => setIsLoading(false)}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
        </div>
        
        <div className="lightbox-info">
          <div className="lightbox-header">
            <h2>{image.title}</h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            
          </div>
          <p>Photographer: 
            <a href={image.photographerUrl} target="_blank" rel="noopener noreferrer">
              {image.photographer}
            </a>
          </p>
          <div className="lightbox-meta">
            <span>❤️ {image.likes} likes</span>
            <span>📅 {image.createdAt}</span>
          </div>
          <span className="lightbox-category">{image.category}</span>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;