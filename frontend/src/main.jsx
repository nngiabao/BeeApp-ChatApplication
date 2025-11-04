import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from "./components/context/UserContext";
import { ContactListProvider } from "./components/context/ContactContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>
            <ContactListProvider>
                <App />
            </ContactListProvider>
        </UserProvider>
    </StrictMode>
)
