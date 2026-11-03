import { useState } from 'react'
import Searchbar from './Searchbar'
import Movielist from './Movielist'

const Buscador = () => {
    const [peliculas, setPeliculas] = useState('')

    return (
        <>
            <Searchbar setPeliculas={setPeliculas} />
            <Movielist peliculas={peliculas} />
        </>
    )
}

export default Buscador