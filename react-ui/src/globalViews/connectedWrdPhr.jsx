import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import { ContentBox, ContentRow } from '../components/contentBoxes';
import Row from '../components/row';
import "../styles/view-styles/style.css";
import { GlobalViewNames, ViewNames } from '../constants';


class ConnectedWordsPhrases extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connectedData: <h5 className='text-center mb-0'>No items</h5>
        };
    }

    componentDidMount() {
        window.electronAPI.getConnected(this.props.type).then(data => {

            if (data.length != 0) {
                data = data.map(item => {
                    return (
                        <div key={item.id} className='connected-item'>
                            <h5>{item.commonMeaning}</h5>
                        </div>
                    );
                });

                this.setState({connectedData: data});
            }
            
        });
    }

    render() {

        return (
            <main className='connected-wrd-phr-view'>

                <div className="container cont-con">
                    <Row>
                        <div className="title-box">
                            <SecondaryButton onClick={() => this.props.changeGlobalView(GlobalViewNames.viewController, ViewNames.words)} style='go-back-btn'>Go Back</SecondaryButton>
                            <h1>Connected {this.props.type == 'wrd'? <>words</>: <>phrases</>}</h1>
                        </div>
                    </Row>

                    <Row>
                        <div className='wrapper'>
                            {this.state.connectedData}
                        </div>
                    </Row>

                    <Row>
                        <PrimaryButton onClick={() => this.props.changeGlobalView(GlobalViewNames.createEditConnected, [this.props.type, null])} style='add-con'>
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> Add Connected {this.props.type == 'wrd'? <>Word</>: <>Phrase</>}
                        </PrimaryButton>
                    </Row>
                </div>
            </main>
        );
    }

}

export default ConnectedWordsPhrases;