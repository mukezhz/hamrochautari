import { useState } from "react"
import { RoomCheck } from "./RoomCheck";
import { RoomStart } from "./RoomStart";

export const Chautari = () => {
    const [start, setStart] = useState(false)
    const handleStart = () => setStart(true)
    return (
        <>
            {
                (!start) ?
                    <RoomCheck check={handleStart} />
                    :
                    <RoomStart />
            }
        </>
    )
}