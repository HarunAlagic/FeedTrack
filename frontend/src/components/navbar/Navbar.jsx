import "./navbar.scss"
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {

    const navigate = useNavigate();
    const { state } = useLocation();
    const [name, setName] = useState();
    const [token, setToken] = useState();
    const [user, setUser] = useState(null); 

    useEffect(() => {
        if (state && state.user) {
            setToken(state.token)
            setUser(state.user);
            console.log("ovo je state.user: "+state.user);
            console.log("ovo je state.token: "+state.token);
        }
    }, [state]);

    console.log("OVO JE LOCAL STORAGE TOKEN: "+localStorage.getItem("token"));

    async function logoutLogic(event) {
        try {
            const response = await fetch("http://localhost:3000/api/logout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: state.token
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
        <div className="navbar">
            <div className="logo">
                <img src="feedtrackLogo.png" alt="" />
                <h1>Admin Dashboard</h1>
            </div>
            <div className="icons">
                <button id="logout" onClick={logoutLogic}>Log Out</button>
                <img src="/search.svg" alt="" className="icon" />
                <img src="/app.svg" alt="" className="icon" />
                <img src="/expand.svg" alt="" className="icon" />
                <div className="notification">
                    <img src="/notifications.svg" alt="" />
                    <span>1</span>
                </div>
                <div className="user">
                    <img src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load" alt="" />
                    {user && <span>Hello {user.name}</span>}
                </div>
                <img src="/setting.svg" alt="" className="icon" />
            </div>
        </div>
    );
};

export default Navbar;