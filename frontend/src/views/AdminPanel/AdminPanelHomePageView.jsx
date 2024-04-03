import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { deployURLs } from "./../../../public/constants.js";

const AdminHomePage = () => {

    const { state } = useLocation();
    const [username, setUsername] = useState();
    const [token, setToken] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (state != null) {
            console.log("state je razlicit od null");
            setUsername(state.username)
            setToken(state.token)
        }
    }, []);

    async function logoutLogic(event) {
        const tokenn = localStorage.getItem("token").token;
        try {
            const response = await fetch(`${deployURLs.backendURL}/api/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "token": JSON.stringify(localStorage.getItem("token")) })
            });

            if (response.ok) {
                // Handle successful logout
                console.log('Logout successful');
                localStorage.clear()
                navigate('/');
            } else {
                // Handle logout error
                console.log(response);
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    return (
        <div>
            <h1>Testni naslov</h1>
            <button id="logout" onClick={logoutLogic}>Log Out</button>
        </div>
    );
}

export default AdminHomePage;
