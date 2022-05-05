export async function fetchToken(url: string, room: string, name: string) {
    const response = await fetch(`${url}/join`, {
        method: "POST",
        body: JSON.stringify({
            room,
            name
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        // credentials: 'include'
    })
    const token = await response.json()
    return token
}

// export async function createRoom(url: string) {
//     const { room, name, token } = history.state
//     const { access_token } = token
//     const serverRoom = await fetch(`${url}/create`, {
//         method: "POST",
//         body: JSON.stringify({
//             room,
//             name,
//             access_token
//         }),
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//         },
//         credentials: 'include'
//     })
//     // body.removeChild(board)
//     const createdRoom = await serverRoom.json()
//     const livekitRoom = getRoom()
//     const connectedRoom = await connectRoom(livekitRoom, url, access_token)
//     return { createdRoom, ...connectedRoom }
// }