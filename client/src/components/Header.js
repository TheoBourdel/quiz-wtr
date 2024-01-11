'use client';
import React from 'react'
import { Button, Navbar } from 'flowbite-react';
import { DarkThemeToggle, Flowbite } from 'flowbite-react';
import { Link } from 'react-router-dom';


export default function Header() {
    return (
        <Navbar fluid rounded>
            <Navbar.Brand href="https://flowbite-react.com">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Quiz Game</span>
            </Navbar.Brand>
            <div className="flex md:order-2 gap-4">
                <Button>Get started</Button>

                <Navbar.Toggle />
                    <Flowbite>
                <DarkThemeToggle />
            </Flowbite>
            </div>
            <Navbar.Collapse>
                <Link to="/">Home</Link>
                <Link to="/admin">Admin</Link>
            </Navbar.Collapse>
        
        </Navbar>
    )
}
