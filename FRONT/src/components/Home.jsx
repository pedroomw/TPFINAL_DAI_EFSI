import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const Home = () => {
    return(
        <>
            <Sidebar/>
            <Outlet></Outlet>
        </>
    )
}

export default Home