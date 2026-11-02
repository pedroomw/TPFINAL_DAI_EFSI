import { useState} from 'react'
import { useAuth } from '../context/authContext'

const Movielist = (peliculas) => {
    return (
        <ul>
           {peliculas.map((pelicula, índice) => {
            <li key = {indice}>{pelicula}</li>
           })}
        </ul>
    )
}

export default Movielist
