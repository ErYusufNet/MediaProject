import React, { useState } from 'react';
import './assets/styles/index.css';
import { NavBar } from './components';
import TasksPage from './pages/TasksPage';
import UploadPage from './pages/UploadPage';
import UsersPage from './pages/UsersPage';

function App() {
    const [content, setContent] = useState<React.JSX.Element | undefined>(undefined);

    // Function for switching active view
    function handleViewChange(newView: string){
        switch (newView) {
            case 'tasks':
                setContent(<TasksPage/>);
                break;
            case 'upload':
                setContent(<UploadPage/>);
                break;
            case 'users':
                setContent(<UsersPage/>);
                break;
        }
    }    

    return (
        <main>
            <NavBar changeView={handleViewChange}/>
            <div id='window-content' className='window-content'>
                {content}
            </div>
        </main>
    );
}

export default App;