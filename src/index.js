import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';

//JS
import MainBot from './components/mainBot';

Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainBot />);