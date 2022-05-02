import { Link } from "react-router-dom";

export const RoomCheck = () => {
    return (
        <>
            <h1>I am Room!!!</h1>
            <h3>TODO here:</h3>
            <ul>
                <li>room route: /[roomname] fetch the access token using username and roomname and check user track </li>
                <li>fetch username or name from firebase</li>
                <li>fetch the acess token from server using username and room name</li>
                <li>save the access token into localStorage</li>
                <li>when connect is clicked redirect to /[roomname]/start</li>
            </ul>
            <Link to="start">Start</Link>

        </>
    )
}