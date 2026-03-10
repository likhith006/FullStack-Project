import React, { useState, useEffect, useCallback, useRef } from 'react';
import ImageCard from './ImageCard';
import Lightbox from './Lightbox';
import './Gallery.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalImages, setTotalImages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Direct API key (in a real app, you'd want to move this to a config file)
  const UNSPLASH_ACCESS_KEY = 'nFSz56fwt7Gk87iifIME1T4E0RLpRoQt7izUXFGK0pg';

  const categories = [
    { id: 'all', name: 'All', icon: '🖼️' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
    { id: 'urban', name: 'Urban', icon: '🏙️' },
    { id: 'architecture', name: 'Architecture', icon: '🏛️' },
    { id: 'travel', name: 'Travel', icon: '✈️' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'people', name: 'People', icon: '👥' },
    { id: 'animals', name: 'Animals', icon: '🐾' },
    { id: 'food', name: 'Food', icon: '🍳' }
  ];

  const fetchImages = useCallback(async () => {
    if (!hasMore && page > 1) return;
    
    setLoading(true);
    try {
      let url;
      const query = searchQuery || filter;
      
      if (query === 'all') {
        url = `https://api.unsplash.com/photos?page=${page}&per_page=12&client_id=${UNSPLASH_ACCESS_KEY}`;
      } else {
        url = `https://api.unsplash.com/search/photos?page=${page}&per_page=12&query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`;
      }

      console.log('Fetching from:', url); // For debugging
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      let newImages;
      let total = 0;
      
      if (query === 'all') {
        newImages = data.map(photo => ({
          id: photo.id,
          url: photo.urls.regular,
          thumb: photo.urls.thumb,
          small: photo.urls.small,
          title: photo.alt_description || photo.description || 'Untitled',
          category: filter === 'all' ? 'uncategorized' : filter,
          photographer: photo.user.name,
          photographerUsername: photo.user.username,
          photographerUrl: photo.user.links.html,
          photographerAvatar: photo.user.profile_image.small,
          downloadUrl: photo.links.download,
          likes: photo.likes,
          color: photo.color,
          createdAt: new Date(photo.created_at).toLocaleDateString()
        }));
        total = data.length;
      } else {
        newImages = data.results.map(photo => ({
          id: photo.id,
          url: photo.urls.regular,
          thumb: photo.urls.thumb,
          small: photo.urls.small,
          title: photo.alt_description || photo.description || 'Untitled',
          category: filter,
          photographer: photo.user.name,
          photographerUsername: photo.user.username,
          photographerUrl: photo.user.links.html,
          photographerAvatar: photo.user.profile_image.small,
          downloadUrl: photo.links.download,
          likes: photo.likes,
          color: photo.color,
          createdAt: new Date(photo.created_at).toLocaleDateString()
        }));
        total = data.total || data.results.length;
      }

      if (page === 1) {
        setImages(newImages);
      } else {
        setImages(prev => [...prev, ...newImages]);
      }

      setTotalImages(total);
      setHasMore(newImages.length === 12);
      setError(null);
    } catch (err) {
      setError('Failed to fetch images. Please check your API key and try again.');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, page, searchQuery, hasMore, UNSPLASH_ACCESS_KEY]);

  useEffect(() => {
    setPage(1);
    setImages([]);
    setHasMore(true);
  }, [filter, searchQuery]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages, page]);
  const observerRef = useRef();
  const lastImageRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSearchQuery('');
    setShowSearch(false);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilter('all');
      setPage(1);
      setShowSearch(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilter('all');
    setPage(1);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <div className="gallery-filters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${filter === category.id && !searchQuery ? 'active' : ''}`}
              onClick={() => handleFilterChange(category.id)}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-name">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="search-container">
          <button 
            className={`search-toggle ${showSearch ? 'active' : ''}`}
            onClick={() => setShowSearch(!showSearch)}
          >
            🔍
          </button>
          
          {showSearch && (
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                autoFocus
              />
              {searchQuery && (
                <button type="button" className="clear-search" onClick={clearSearch}>
                  ✕
                </button>
              )}
              <button type="submit" className="search-submit">Search</button>
            </form>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      <div className="gallery-grid">
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={index === images.length - 1 ? lastImageRef : null}
          >
            <ImageCard
              image={image}
              onClick={() => setSelectedImage(image)}
            />
          </div>
        ))}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading amazing images...</p>
        </div>
      )}

      {!loading && !hasMore && images.length > 0 && (
        <div className="end-message">
          <p>✨ You've explored all images! ✨</p>
          <button 
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
              setPage(1);
            }}
            className="explore-more-btn"
          >
            Explore More
          </button>
        </div>
      )}

      {!loading && images.length === 0 && !error && (
        <div className="no-images">
          <p>📷 No images found</p>
          <p>Try a different category or search term</p>
          <button onClick={() => {
            setFilter('all');
            setSearchQuery('');
          }} className="reset-btn">
            View All Images
          </button>
        </div>
      )}

      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onNext={() => {
            const currentIndex = images.findIndex(img => img.id === selectedImage.id);
            const nextIndex = (currentIndex + 1) % images.length;
            setSelectedImage(images[nextIndex]);
          }}
          onPrev={() => {
            const currentIndex = images.findIndex(img => img.id === selectedImage.id);
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            setSelectedImage(images[prevIndex]);
          }}
          onDownload={() => handleDownload(selectedImage)}
        />
      )}
    </div>
  );
};

export default Gallery;