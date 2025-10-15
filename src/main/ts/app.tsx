import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as BrowserRouter, Route, Routes } from 'react-router-dom'

import './app.scss'
import { Login } from './login'
import { PelotonToGarmin } from './pelotonToGarmin'

const container = document.getElementById('root')
if (container) {
    const root = createRoot(container)
    root.render(
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/peloton-to-garmin"
                        element={<PelotonToGarmin />}
                    />
                    <Route path="/" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </>,
    )
}
