import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {UserProvider} from "./components/context/UserContext";
import {ContactListProvider} from "./components/context/ContactContext.jsx";
import {ChatProvider} from "./components/context/ChatContext";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>
            <ChatProvider>
                <ContactListProvider>
                    <App/>
                </ContactListProvider>
            </ChatProvider>
        </UserProvider>
    </StrictMode>
)
