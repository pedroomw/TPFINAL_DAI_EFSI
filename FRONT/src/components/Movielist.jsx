const Movielist = ({ peliculas }) => {
    const movies = peliculas?.Search ?? [];

    return (
        <ul>
            {movies.map((pelicula, index) => (
                <li key={pelicula.imdbID || index}>
                    <h1>{pelicula.Title}</h1>
                    <h2>{pelicula.Year}</h2>
                    <p>IMDb ID: {pelicula.imdbID}</p>
                    <p>Type: {pelicula.Type}</p>
                    {pelicula.Poster && pelicula.Poster !== 'N/A' ? (
                        <img src={pelicula.Poster} alt={pelicula.Title} />
                    ) : (
                        <p>Sin imagen</p>
                    )}
                </li>
            ))}
        </ul>
    )
}

export default Movielist