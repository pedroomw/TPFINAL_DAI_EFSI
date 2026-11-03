import { useState} from 'react'
import { useAuth } from '../context/authContext'

const Movielist = (peliculas) => {
    return (
        <>
            <pre>{JSON.stringify(peliculas, null, 2)}</pre>
        </>
    )
}

export default Movielist
