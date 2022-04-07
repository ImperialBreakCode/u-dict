export default function Row(props) {
    return(
        <div className="row">
            <div className='col'>
                {props.children}
            </div>
        </div>
    );
}