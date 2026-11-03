import { useState } from 'react'
import { buscarPelícula } from '../services/omdbService'

const Searchbar = ({ setPeliculas }) => {
    const [nombre, setNombre] = useState('')

    const handleSearch = async (e) => {
        e.preventDefault()
        const respuesta = await buscarPelícula(nombre)
        setPeliculas(respuesta)
    }

    return (
        <>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder='Ingrese el nombre de la película'
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
                <button type="submit">Buscar</button>
            </form>
        </>
    )
}

export default Searchbar