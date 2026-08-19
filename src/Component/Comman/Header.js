import React from "react";
import {  Link } from "react-router-dom";
const Header=()=>{
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    
                    <img src={process.env.PUBLIC_URL + "/images.jpg"} width={50}></img>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/user" className="nav-link">User List</Link>
                            <Link to="/todo" className="nav-link">Todo List</Link>
                            <Link to="/quotesList" className="nav-link">Quotes List</Link>
                            <Link to="/Role" className="nav-link">Role List</Link>
                            <Link to="/Class-List" className="nav-link">Class List</Link>
                            <Link to="/Student-List" className="nav-link">Student List</Link>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/Attenddence-list" className="nav-link">Attendence</Link>

                            
                            
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header