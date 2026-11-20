import { useState } from 'react';

/**
 * Poster con fallback automático si la imagen no carga.
 * Props:
 *   src       — URL de la imagen
 *   alt       — texto alternativo / título
 *   className — clase CSS (default: "movie-poster")
 */
const MoviePoster = ({ src, alt, className = 'movie-poster' }) => {
  const [failed, setFailed] = useState(false);

  if (!src || src === 'N/A' || failed) {
    return (
      <div className={`${className} no-poster`}>
        <span>🎬</span>
        <small>{alt || 'Sin imagen'}</small>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
};

export default MoviePoster;
