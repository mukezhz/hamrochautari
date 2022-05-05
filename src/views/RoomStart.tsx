import { faSquare, faThLarge, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Room, RoomEvent, VideoPresets } from 'livekit-client'
import { DisplayContext, DisplayOptions, LiveKitRoom } from 'livekit-react'
import { useEffect, useState } from "react"
import "react-aspect-ratio/aspect-ratio.css"
import { useNavigate, useLocation } from 'react-router-dom'
export const RoomStart = () => {
    const [numParticipants, setNumParticipants] = useState(0)
    const [load, setLoad] = useState(false)
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
        navigate({
            pathname: '/',
        })
    }

    useEffect(() => {
        return () => {
            if (!location.pathname.includes('start')) {
                onLeave()
            }
        }
    }, [load])

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
        console.log("sijfasdi fjasdif ");
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

    return (
        <>
            <DisplayContext.Provider value={displayOptions}>
                <div className="roomContainer">
                    <div className="topBar">
                        <a href="/">
                            <h2>Hamro Conference</h2>
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
                    <LiveKitRoom
                        url={url}
                        token={token}
                        onConnected={room => {
                            onConnected(room);
                            room.on(RoomEvent.ParticipantConnected, () => updateParticipantSize(room))
                            room.on(RoomEvent.ParticipantDisconnected, () => onParticipantDisconnected(room))
                            updateParticipantSize(room);
                        }}
                        connectOptions={{
                            adaptiveStream: isSet('adaptiveStream'),
                            dynacast: isSet('dynacast'),
                            videoCaptureDefaults: {
                                resolution: VideoPresets.h720.resolution,
                            },
                            logLevel: 'error',
                        }}
                        onLeave={onLeave}
                    />
                </div>
            </DisplayContext.Provider>
        </>
    )
}
