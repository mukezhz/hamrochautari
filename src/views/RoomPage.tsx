import '../index.css'
import { faSquare, faThLarge, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Room, RoomEvent, VideoPresets, DataPacket_Kind, RemoteParticipant } from 'livekit-client'
import { DisplayContext, DisplayOptions, LiveKitRoom } from 'livekit-react'
import { useState } from "react"
import "react-aspect-ratio/aspect-ratio.css"
import { Link, useNavigate, useLocation } from 'react-router-dom'
export const RoomPage = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [numParticipants, setNumParticipants] = useState(0)
    const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
        stageLayout: 'grid',
        showStats: false,
    })
    const navigate = useNavigate()
    const query = new URLSearchParams(useLocation().search)
    const url = localStorage.getItem("url");
    const token = localStorage.getItem("token");
    const recorder = localStorage.getItem("recorder");
    const [room, setRoom] = useState<Room>()
    // const url = query.get('url')
    // const token = query.get('token')
    // const recorder = query.get('recorder')
    function handleSend(message: string) {
        setMessages([...messages]);
        if (!room) return
        const encode = new TextEncoder().encode(JSON.stringify(message))
        room.localParticipant.publishData(encode, 0)
    }

    if (!url || !token) {
        return (
            <div>
                <h1> url and token are required </h1>
            </div>
        )
    }

    const onLeave = () => {
        navigate({
            pathname: '/test',
        })
    }

    const updateParticipantSize = (room: Room) => {
        setNumParticipants(room.participants.size + 1);
    }

    const onParticipantDisconnected = (room: Room) => {
        updateParticipantSize(room)

        /* Special rule for recorder */
        if (recorder && parseInt(recorder, 10) === 1 && room.participants.size === 0) {
            console.log("END_RECORDING")
        }
    }

    const updateOptions = (options: DisplayOptions) => {
        setDisplayOptions({
            ...displayOptions,
            ...options,
        });
    }

    async function onConnected(room: Room, query: URLSearchParams) {
        // make it easier to debug
        (window as any).currentRoom = room;
        setRoom(room)

        if (isSet(query, 'audioEnabled')) {
            const audioDeviceId = query.get('audioDeviceId');
            if (audioDeviceId && room.options.audioCaptureDefaults) {
                room.options.audioCaptureDefaults.deviceId = audioDeviceId;
            }
            await room.localParticipant.setMicrophoneEnabled(true);
        }

        if (isSet(query, 'videoEnabled')) {
            const videoDeviceId = query.get('videoDeviceId');
            if (videoDeviceId && room.options.videoCaptureDefaults) {
                room.options.videoCaptureDefaults.deviceId = videoDeviceId;
            }
            await room.localParticipant.setCameraEnabled(true);
        }
    }
    const onDataReceived = async (payload: Uint8Array, participant: RemoteParticipant | undefined, kind: DataPacket_Kind = 0) => {
        const message = new TextDecoder().decode(payload);
        messages.push(message)
        setMessages([...messages])
    }

    function isSet(query: URLSearchParams, key: string): boolean {
        return query.get(key) === '1' || query.get(key) === 'true';
    }

    return (
        <>
            <DisplayContext.Provider value={displayOptions}>
                <div className="roomContainer">
                    <div className="topBar">
                        <Link to="/">
                            <h2>{url}</h2>
                        </Link>
                        <div className="right">
                            <div>
                                <input id="showStats" type="checkbox" onChange={(e) => updateOptions({ showStats: e.target.checked })} />
                                <label htmlFor="showStats">Show Stats</label>
                            </div>
                            <div>
                                <button
                                    className="iconButton"
                                    disabled={displayOptions.stageLayout === 'grid'}
                                    onClick={() => {
                                        updateOptions({ stageLayout: 'grid' })
                                    }}
                                >
                                    <FontAwesomeIcon height={32} icon={faThLarge} />
                                </button>
                                <button
                                    className="iconButton"
                                    disabled={displayOptions.stageLayout === 'speaker'}
                                    onClick={() => {
                                        updateOptions({ stageLayout: 'speaker' })
                                    }}
                                >
                                    <FontAwesomeIcon height={32} icon={faSquare} />
                                </button>
                            </div>
                            <div className="participantCount">
                                <FontAwesomeIcon icon={faUserFriends} />
                                <span>{numParticipants}</span>
                            </div>
                        </div>
                    </div>
                    <div style={displayOptions.stageLayout === 'grid' ? { width: "90%", margin: "0 auto", height: "90vh" } : { height: "90vh" }}>
                        <LiveKitRoom
                            url={url}
                            token={token}
                            onConnected={room => {
                                room.on(RoomEvent.ParticipantConnected, () => updateParticipantSize(room))
                                room.on(RoomEvent.ParticipantDisconnected, () => onParticipantDisconnected(room))
                                room.on(RoomEvent.DataReceived, async (payload: Uint8Array, participant?: RemoteParticipant | undefined, kind?: DataPacket_Kind | undefined) => await onDataReceived(payload, participant, kind))
                                onConnected(room, query);
                                updateParticipantSize(room);
                            }}
                            connectOptions={{
                                adaptiveStream: isSet(query, 'adaptiveStream'),
                                dynacast: isSet(query, 'dynacast'),
                                videoCaptureDefaults: {
                                    resolution: VideoPresets.h720.resolution,
                                },
                                logLevel: 'error',
                            }}
                            onLeave={onLeave}
                        />
                    </div>
                </div>
            </DisplayContext.Provider>
        </>
    )
}
