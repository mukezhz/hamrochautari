interface RedirectProp {
    count: number
}
export const Redirect = ({ count }: RedirectProp) => {
    return (
        <div className="App-header">
            <h1>Unabe to fetch user info 🙁🙁🙁 </h1>
            <p> Redirecting to home in: {count} seconds </p>
        </div>
    )
}