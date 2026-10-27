import { useState, useEffect } from 'react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault() 
        try {
            await login(email, password);
            navigate('/home', { replace: true });
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}> 
                <input 
                    type="text" 
                    value={email} 
                    placeholder="Ingresá tu email" 
                    onChange={(e) => { setEmail(e.target.value) }} 
                />

                <input 
                    type="text" 
                    value={password} 
                    placeholder="Ingresá tu contraseña" 
                    onChange={(e) => { setPassword(e.target.value) }} 
                />
                
                <button type="submit">Ingresar</button> 
            </form>
        </>
    )
}

export default Login
