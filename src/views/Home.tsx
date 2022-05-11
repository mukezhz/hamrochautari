import { useEffect, useState } from "react";
import { uniqueNamesGenerator, Config, adjectives, colors, animals, names } from 'unique-names-generator';
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { getUser, logout } from "../utils/auth"

const generateRoom = () => {
    const customConfig: Config = {
        dictionaries: [colors, animals, names, adjectives],
        separator: '-',
        length: 2,
    };

    const shortName: string = uniqueNamesGenerator(customConfig); // big-donkey
    localStorage.setItem('room', shortName || '')
    return shortName
}

export const Home = () => {
    const hosturl = window.__RUNTIME_CONFIG__.REACT_APP_HOST_URL || "http://localhost:3000"
    const [room, setRoom] = useState(localStorage.getItem('room') || '')
    const [user, setUser] = useState('')

    const handleLogout = async () => {
        await logout()
        setUser('')
    }
    useEffect(() => {
        const user = getUser()
        const room = localStorage.getItem('room') || ''
        if (user)
            setUser(user?.displayName || '')
        setRoom(room)
    }, [user])
    return (
        <>
            <h1 className="center title">Welcome to Hamro Conference!!!</h1>
            <div className="generate">
                {
                    user !== '' ?
                        <button className="btn btn-generate" onClick={() => { setRoom(generateRoom()) }}>Generate a room</button>
                        : ''
                }
                {
                    room === '' ? "" :
                        <>
                            <h1>Room Name: <span>{room}</span></h1>

                        </>
                }
                {
                    user && room ?
                        <>
                            <p style={{ margin: "3rem 0 1rem 0" }}>Invite your friend to join the room</p>
                            <Link to={room}>{room === "" ? "" : hosturl + "/" + room} </Link>
                        </>
                        : ''}

                {
                    user !== '' ?
                        <Button css="btn btn-logout" click={handleLogout}>Logout</Button>
                        : <Link to="/login">
                            <button className="btn btn-login">Login</button>
                        </Link>
                }
            </div>
        </>
    )
}