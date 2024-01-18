'use client';
import React from 'react'
import { Button, Navbar } from 'flowbite-react';
import { DarkThemeToggle, Flowbite } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function Header() {
    const { user} = useAuth();
    return (
        <Navbar fluid>
            <Navbar.Brand href="https://flowbite-react.com">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    Quiz Game { user && user.username}
                </span>
            </Navbar.Brand>
            <div className="flex md:order-2 gap-4">
                { user && 
                <Button>
                    <Link to="/quizs">PLAY</Link>
                </Button>
                }

                {!user  && 
                <div className="mt-3 flex space-x-2">
                    <Button> <Link to="/login">Log in</Link></Button>
                    <Button><Link to="/register">Sign up</Link></Button>
                </div>
                } 
                <Navbar.Toggle />
                <Flowbite>
                    <DarkThemeToggle />
                </Flowbite>
            </div>
            <Navbar.Collapse>
                { user && 
                <div className="mt-3 flex space-x-12">
                    <Link to="/">Home</Link>
                    { user && user.role == 'ADMIN'
                        ?
                        <Link to="/admin">Admin</Link>
                        :''
                    }
                </div>}
            </Navbar.Collapse>
        </Navbar>
    )
}
