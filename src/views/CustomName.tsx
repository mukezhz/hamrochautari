import { Button } from "../components/Button"
import React from "react";

interface CustomNameProp {
    customToggle?: React.Dispatch<React.SetStateAction<boolean>>
}

export const CustomName = ({ customToggle }: CustomNameProp) => {
    const handleSubmit = (e: any) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const username: string = data.get('username')?.toString() || ''
        localStorage.setItem('username', username)
        if (customToggle) customToggle(false)
    }
    return (
        <>
            <h1> Enter you name</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" id="username" />
                <Button css="btn">Submit</Button>
            </form>
        </>
    )
} 