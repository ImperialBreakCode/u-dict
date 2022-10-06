export function ContentBox(props) {
    return(
        <div className="content-box">
            {props.children}
        </div>
    );
}

export function ContentRow(props) {
    return(
        <div className="content-row">
            {props.children}
        </div>
    );
}