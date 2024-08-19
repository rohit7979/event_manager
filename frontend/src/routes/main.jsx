
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { Signup } from '../pages/Signup'
import { Login } from '../pages/Login'
import { CreateEvent } from '../pages/Events'


export const MainRoute = () => {
  return (
    <div>
        <Routes>
            <Route element ={<Signup/>} path='/' />
            <Route element ={<Login/>} path='/login' />
            {/* <Route element ={<Todos/>} path='/todos' /> */}
            <Route element ={<CreateEvent/>} path='/events' />
        </Routes>
    </div>
  )
}
