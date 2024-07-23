import { useState } from 'react';
import { createContext } from 'react'

const UserContext = createContext();
const UserProvider = ({children}) => {
    const [userName, setUserName] = useState('');
    const [clientId, setClientId] = useState('');

    return (
        <div>
            <UserContext.Provider value={{userName, setUserName, clientId, setClientId}}>
                {children}
            </UserContext.Provider>
        </div>
    );
}
export {UserContext, UserProvider};
