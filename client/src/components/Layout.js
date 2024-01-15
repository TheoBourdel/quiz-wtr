import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <>
        <Header />
        <main className='p-4 dark:bg-gray-800'>
            <Outlet />
        </main>
    </>
  )
}