import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as BrowserRouter, Route, Routes } from 'react-router-dom'

import './app.scss'
import { Login } from './login'
import { PelotonToGarmin } from './pelotonToGarmin'

ReactDOM.render(
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/peloton-to-garmin" element={<PelotonToGarmin />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </BrowserRouter>
    </>,
    document.getElementById('root'),
)
