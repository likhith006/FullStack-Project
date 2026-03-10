import React, { useState } from 'react';
import './ImageCard.css';

const ImageCard = ({ image, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="image-card" onClick={onClick}>
      <div className="image-wrapper">
        {!isLoaded && <div className="image-skeleton"></div>}
        <img 
          src={image.thumb || image.url} 
          alt={image.title}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          style={{ opacity: isLoaded ? 1 : 0 }}
        />
        <div className="image-overlay">
          <div className="image-info">
            <h3>{image.title}</h3>
            <p>by {image.photographer}</p>
            <div className="image-meta">
              <span>❤️ {image.likes}</span>
              <span className="category-tag">{image.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;