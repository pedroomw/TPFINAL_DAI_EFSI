import { useState} from 'react'
import { useAuth } from '../context/authContext'
import { buscarPelícula } from '../services/omdbService'

const Searchbar = (setPeliculas) => {
    const handleSearch = (id) => {
        const respuesta = buscarPelicula(id)
        setPeliculas(respuesta)
    }
    return (
        <>
           
        </>
    )
}

export default Searchbar
