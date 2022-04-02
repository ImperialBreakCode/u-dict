

export function Table(props) {

    const style = `table table-dark table-striped ${props.overStyle ?? ''}`;

    const theads = props.head.map((text, index) => 
        <th key={index} scope='col'>{text}</th>
    );

    return(
        <table className={style}>
            <thead>
                <tr>
                    {theads}
                </tr>
            </thead>
            <tbody>
                {props.data}
            </tbody>
        </table>
    );
}