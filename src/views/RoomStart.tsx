import 'react-chat-widget/lib/styles.css';
import '../chatwidget.css'
import '../index.css'
import { Widget, addResponseMessage } from 'react-chat-widget';
import { faSquare, faThLarge, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Room, RoomEvent, VideoPresets, DataPacket_Kind, RemoteParticipant } from 'livekit-client'
import { DisplayContext, DisplayOptions, LiveKitRoom } from 'livekit-react'
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { addMessage } from "../store/messages";
import "react-aspect-ratio/aspect-ratio.css"
import { useNavigate, useLocation } from 'react-router-dom'
export const RoomStart = () => {
    const dispatch = useDispatch()
    const [numParticipants, setNumParticipants] = useState(0)
    const [room, setRoom] = useState<Room>()
    const [client, setClient] = useState('')
    const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
        stageLayout: 'grid',
        showStats: false,
    })
    const navigate = useNavigate()
    const location = useLocation()
    const url = localStorage.getItem("url");
    const token = localStorage.getItem("token");
    const recorder = localStorage.getItem("recorder");
    const onLeave = () => {
        localStorage.removeItem('adaptiveStream')
        localStorage.removeItem('audioEnabled')
        localStorage.removeItem('dynacast')
        localStorage.removeItem('loglevel:livekit')
        localStorage.removeItem('simulcast')
        localStorage.removeItem('videoEnabled')
        localStorage.removeItem('url')
        localStorage.removeItem('room')
        navigate({
            pathname: '/',
        })
    }

    useEffect(() => {
        return () => {
            if (location.pathname.length < 4) {
                onLeave()
            }
        }
        // eslint-disable-next-line
    }, [location.pathname.length])

    if (!url || !token) {
        return (
            <div>
                <h1> url and token are required </h1>
            </div>
        )
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

    async function onConnected(room: Room) {
        // make it easier to debug
        (window as any).currentRoom = room;
        setRoom(room)
        if (isSet('audioEnabled')) {
            const audioDeviceId = localStorage.getItem('audioDeviceId');
            if (audioDeviceId && room.options.audioCaptureDefaults) {
                room.options.audioCaptureDefaults.deviceId = audioDeviceId;
            }
            await room.localParticipant.setMicrophoneEnabled(true);
        }

        if (isSet('videoEnabled')) {
            const videoDeviceId = localStorage.getItem('videoDeviceId');
            if (videoDeviceId && room.options.videoCaptureDefaults) {
                room.options.videoCaptureDefaults.deviceId = videoDeviceId;
            }
            await room.localParticipant.setCameraEnabled(true);
        }
    }

    function isSet(key: string): boolean {
        return localStorage.getItem(key) === '1' || localStorage.getItem(key) === 'true';
    }

    function handleSend(message: string) {
        dispatch(
            addMessage(message)
        )
        if (!room) return
        const encode = new TextEncoder().encode(message)
        room.localParticipant.publishData(encode, 0)
    }

    const onDataReceived = async (payload: Uint8Array, participant: RemoteParticipant | undefined, kind: DataPacket_Kind = 0) => {
        setClient(participant?.identity || '')
        let message = new TextDecoder().decode(payload);
        message = `${participant?.identity}: ${message}`
        dispatch(addMessage(message))
        addResponseMessage(message, participant?.sid ?? 'hello')
    }

    return (
        <>
            <DisplayContext.Provider value={displayOptions}>
                <div className="roomContainer">
                    <div className="topBar">
                        <a href="/">
                            <h2>Hamro Chautari</h2>
                        </a>
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
                                onConnected(room);
                                updateParticipantSize(room);
                            }}
                            connectOptions={{
                                adaptiveStream: isSet('adaptiveStream'),
                                dynacast: isSet('dynacast'),
                                videoCaptureDefaults: {
                                    resolution: VideoPresets.h1080.resolution,
                                },
                                logLevel: 'error',
                            }}
                            onLeave={onLeave}
                        />
                    </div>
                    {
                        room ?
                            <Widget
                                handleNewUserMessage={handleSend}
                                emojis={true}
                                // profileClientAvatar={`https://ui-avatars.com/api/?name=${room.localParticipant.identity}`}
                                titleAvatar={`https://ui-avatars.com/api/?name=${room.localParticipant.identity}`}
                                profileAvatar={`https://ui-avatars.com/api/?name=${client}`}
                                title={room.localParticipant.identity}
                                subtitle={"Welcome to Hamro Chautari"}
                                autofocus={false}
                                handleSubmit={() => { return false }}
                                showBadge={true}
                                senderPlaceHolder="Enter your message..."
                                handleToggle={() => console.log("toogleing")}
                                chatId={room.localParticipant.identity}
                                renderCustomComponent={<h1>Hello</h1>}
                                showCloseButton={true}
                            />
                            : ''
                    }
                </div>
            </DisplayContext.Provider>
        </>
    )
}
