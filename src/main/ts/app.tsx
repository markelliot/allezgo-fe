import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import './app.scss'
import { Nav } from './nav'
import { Login } from './login'
import { PelotonToGarmin } from './pelotonToGarmin'


// render root element
ReactDOM.render(
    <>
    <Nav/>
    <Router>
        <Switch>
            <Route path="/peloton-to-garmin">
                <PelotonToGarmin />
            </Route>
            <Route path="/">
                <Login />
            </Route>
        </Switch>
    </Router>
    </>,
    document.getElementById('root'),
)
