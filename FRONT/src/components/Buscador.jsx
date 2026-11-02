import { useState} from 'react'
import { useAuth } from '../context/authContext'
import Searchbar from './Searchbar'
import Movielist from './Movielist'
import { buscarPelícula } from '../services/omdbService'

const Buscador = () => {
    const [peliculas, setPeliculas] = useState([])
    return (
        <>
            <Searchbar setPeliculas = {setPeliculas}/>
            <Movielist peliculas = {peliculas}/>
        </>
    )
}

export default Buscador
