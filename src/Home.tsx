import { useState } from "react";
import { uniqueNamesGenerator, Config, adjectives, colors, animals, names } from 'unique-names-generator';
import { Link } from "react-router-dom";

const generateRoom = () => {
    const customConfig: Config = {
        dictionaries: [colors, animals, names, adjectives],
        separator: '-',
        length: 2,
    };

    const shortName: string = uniqueNamesGenerator(customConfig); // big-donkey
    return shortName
}

export const Hello = () => {
    const { REACT_APP_URL } = process.env
    const [room, setRoom] = useState("")
    return (
        <>
            <h1>Admin can generate a room!!!</h1>
            <button onClick={() => { setRoom(generateRoom()) }}>Generate a room</button>
            <div>
                <h1>Room Name: <span>{room === "" ? "" : room}</span></h1>
            </div>
            <p style={{ margin: "3rem 0 1rem 0" }}>Invite your friend to join the room</p>
            <Link to={room}>{room === "" ? "" : REACT_APP_URL + "/" + room} </Link>
            <h3>TODO LIST</h3>
            <ul>
                <li>room route: /[roomname] fetch the access token using username and roomname and check user track </li>
                <li>actual conference room route: /[roomname]/start start the room where user can publish their track </li>
                <hr />
                <li>fetch username or name from firebase</li>
                <li>Generate a room when clicking on generate button</li>
                <li>redirect to /[generatedname]</li>
                <li>fetch the access token using generatedname and username </li>
                <li>when click on link it should behave like /test route but there won't be any token and live-kit url section</li>
                <li>page will be same as /test but no input form just video to check whether it is working or not</li>
                <li>when user click on connect depending upon the value choose the room page will be shown</li>
                <li>when user randomly type random room name /roomname fetch username and roomname and get the token and do the above process</li>
                <li>if the user has not created the account redirect to login page</li>
            </ul>
        </>
    )
}