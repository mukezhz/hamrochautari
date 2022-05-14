import '../index.css'
interface ButtonProp {
    css?: string | '';
    click?: React.MouseEventHandler<Element>;
    children?: React.ReactChild | null;
}
export const Button = (props: ButtonProp) => {
    return (
        <button className={props.css} onClick={props.click}>{props.children}</button>
    )
}