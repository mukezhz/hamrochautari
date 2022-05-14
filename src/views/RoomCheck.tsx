import "../App.css"
import { Link, useParams, useNavigate } from "react-router-dom";
import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { createLocalVideoTrack, LocalVideoTrack } from 'livekit-client'
import { AudioSelectButton, ControlButton, VideoRenderer, VideoSelectButton } from 'livekit-react'
import { ReactElement, useEffect, useState } from "react"
import { AspectRatio } from 'react-aspect-ratio'
import { fetchToken } from "../utils";
import { getUser } from "../utils/auth";
import { CustomName } from "./CustomName";
import { Redirect } from "../components/Redirect";
interface RoomCheckProp {
    check: Function;
}
export const RoomCheck = (props: RoomCheckProp) => {
    const { roomname = '' } = useParams();
    // state to pass onto room
    const serverUrl = window.__RUNTIME_CONFIG__.REACT_APP_URL || 'http://localhost:8000'
    const wssUrl = window.__RUNTIME_CONFIG__.REACT_APP_WSS || 'ws://localhost:7880'
    const [url, setUrl] = useState(serverUrl)
    const user = getUser()
    const name = user?.displayName || localStorage.getItem('username')
    const [token, setToken] = useState<string>('')
    const simulcast = true
    const dynacast = useState(true)
    const adaptiveStream = true
    const [videoEnabled, setVideoEnabled] = useState(false)
    const [audioEnabled, setAudioEnabled] = useState(false)
    // disable connect button unless validated
    const [connectDisabled, setConnectDisabled] = useState(true)
    const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
    const [audioDevice, setAudioDevice] = useState<MediaDeviceInfo>();
    const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo>();
    const [count, setCount] = useState(5)
    const [customName, setCustomName] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        if (!roomname || !url) {
            count > 0 && setTimeout(() => {
                setCount(count - 1)
            }, 1000)
            if (count === 0) navigate({
                pathname: '/'
            })
        }
        name ?
            (async () => {
                try {
                    const response = await fetchToken(url, roomname, name)
                    const { access_token = '' } = response;
                    setToken(access_token)
                    setUrl(wssUrl)
                } catch (e) {
                    console.error("Fetching...");
                }
            })()
            :
            setCustomName(true)
        count > 0 && setTimeout(() => {
            setCount(count - 1)
        }, 1000)
    }, [count, name, roomname, url, navigate, wssUrl])

    useEffect(() => {
        if (token && url) {
            setConnectDisabled(false)
        } else {
            setConnectDisabled(true)
        }
    }, [token, url])

    const toggleVideo = async () => {
        if (videoTrack) {
            videoTrack.stop()
            setVideoEnabled(false)
            setVideoTrack(undefined)
        } else {
            const track = await createLocalVideoTrack({
                deviceId: videoDevice?.deviceId,
            })
            setVideoEnabled(true)
            setVideoTrack(track)
        }
    }

    useEffect(() => {
        // enable video by default
        let video: LocalVideoTrack;
        if (name)
            createLocalVideoTrack({
                deviceId: videoDevice?.deviceId,
            }).then((track) => {
                video = track;
                // track?.stop()
                setVideoEnabled(true)
                setVideoTrack(track)
            })
        return () => {
            video?.stop()
        }
    }, [videoDevice, name])

    const toggleAudio = () => {
        if (audioEnabled) {
            setAudioEnabled(false)
        } else {
            setAudioEnabled(true)
        }
    }

    const selectVideoDevice = (device: MediaDeviceInfo) => {
        setVideoDevice(device);
        if (videoTrack) {
            if (videoTrack.mediaStreamTrack.getSettings().deviceId === device.deviceId) {
                return
            }
            // stop video
            videoTrack.stop()
        }
    }

    const connectToRoom = async () => {
        if (videoTrack) {
            videoTrack.stop()
        }

        if (window.location.protocol === 'https:' &&
            url.startsWith('ws://') && !url.startsWith('ws://localhost')) {
            alert('Unable to connect to insecure websocket from https');
            return
        }

        const params: { [key: string]: string } = {
            url,
            token,
            videoEnabled: videoEnabled ? '1' : '0',
            audioEnabled: audioEnabled ? '1' : '0',
            simulcast: simulcast ? '1' : '0',
            dynacast: dynacast ? '1' : '0',
            adaptiveStream: adaptiveStream ? '1' : '0',
        }
        if (audioDevice) {
            params.audioDeviceId = audioDevice.deviceId;
        }
        if (videoDevice) {
            params.videoDeviceId = videoDevice.deviceId;
        } else if (videoTrack) {
            // pass along current device id to ensure camera device match
            const deviceId = await videoTrack.getDeviceId();
            if (deviceId) {
                params.videoDeviceId = deviceId;
            }
        }
        if (Object.entries(params).length)
            for (const param of Object.entries(params)) {
                const [k, v] = param;
                localStorage.setItem(k, v);
            }
        props.check()
    }

    let videoElement: ReactElement;
    if (videoTrack) {
        videoElement = <VideoRenderer track={videoTrack} isLocal={true} width="100%" />;
    } else {
        videoElement = <div className="placeholder" />
    }

    return (
        <>
            {
                !name && !customName ?
                    <Redirect count={count} />
                    :
                    <div className="prejoin">
                        <main>
                            <Link to="/">
                                <h1 className="center">Hamro Conference</h1>
                            </Link>
                            <hr />
                            <h3 className="center">Testing your camera/mic</h3>
                            <div className="videoSection">
                                <AspectRatio ratio={16 / 9}>
                                    {videoElement}
                                </AspectRatio>
                            </div>

                            <div className="controlSection">
                                <div>
                                    <AudioSelectButton
                                        isMuted={!audioEnabled}
                                        onClick={toggleAudio}
                                        onSourceSelected={setAudioDevice}
                                    />
                                    <VideoSelectButton
                                        isEnabled={videoTrack !== undefined}
                                        onClick={toggleVideo}
                                        onSourceSelected={selectVideoDevice}
                                    />
                                </div>
                                <div className="right">
                                    <ControlButton
                                        label={!token ? "Connecting" : "Join Room"}
                                        disabled={connectDisabled}
                                        //@ts-ignore
                                        icon={faBolt}
                                        onClick={connectToRoom} />
                                </div>
                            </div>
                        </main>
                        {customName ? <CustomName customToggle={setCustomName} /> : ''}
                    </div>
            }
        </>
    )
}