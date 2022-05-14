import "../index.css"
import { useEffect, useState } from "react";
import { logout, signInWithGoogle, getUserWithGoogle } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState('')
    const [load, setLoad] = useState(false)
    useEffect(() => {
        setUser(localStorage.getItem('user') || '')
        if (user) navigate('/')
        else (async () => {
            const result = await getUserWithGoogle()
            setUser(result?.displayName || '')
            setLoad(true)
        })()
    }, [user, navigate])
    const handleLoginWithGoogle = async () => {
        await signInWithGoogle()
    }

    const handleLogout = async () => {
        await logout()
        setUser('')
    }
    return (
        <>
            <h1 className="center">Login Page</h1>
            <div className="center">
                {
                    load ?
                        <div className="login">
                            {user === '' ?
                                <button className="btn google" onClick={handleLoginWithGoogle}>Login with Google</button>
                                :
                                <>
                                    <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
                                </>
                            }
                        </div>
                        : <div id="loading"></div>
                }
            </div>
        </>
    )
}