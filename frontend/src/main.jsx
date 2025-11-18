import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {UserProvider} from "./components/context/UserContext";
import {ContactListProvider} from "./components/context/ContactContext.jsx";
import {ChatProvider} from "./components/context/ChatContext";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')).render(
    <StrictMode>

        <BrowserRouter>
            <UserProvider>
                <ChatProvider>
                    <ContactListProvider>
                        <App/>
                    </ContactListProvider>
                </ChatProvider>
            </UserProvider>
        </BrowserRouter>


    </StrictMode>
)
