import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import Modal from 'react-modal';

//CSS
import '../styles/mediaBot.css';

Modal.setAppElement('#root');

function MediaBot(props) {

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {

        setModalIsOpen(true);
    };

    const closeModal = () => {

        setModalIsOpen(false);
    };

    const handleVideoEnded = () => {

        closeModal();
    };

    return (

        <div>
            <button className="welcomeButton" onClick={openModal}>{props.title}</button>

            <Modal

                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={true}
                style={{

                    overlay: {

                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: '9999'
                    },
                    content: {

                        backgroundColor: 'black',
                        width: '720px',
                        height: '576px',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        border: 'none',
                        overflow: 'hidden',
                        zIndex: '9999',
                    }
                }}
            >
            <ReactPlayer

                url={props.url}
                playing={true}
                controls={false}
                loop={false}
                muted={false}
                volume={0.8}
                width="100%"
                height="100%"
                onEnded={handleVideoEnded}
                style={{zIndex: '9999'}}
            />
            </Modal>
        </div>
    );
}
export default MediaBot;