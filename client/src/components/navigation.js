import React from 'react';
import { NavLink } from "react-router-dom";


const Navigation = () => {
    return(
        <div>
            <NavLink to="/">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
        </div>
    );
};

export default Navigation;