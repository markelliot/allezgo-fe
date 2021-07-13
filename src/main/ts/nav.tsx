import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Alignment, Button, Navbar } from '@blueprintjs/core'

import './navbar.scss'

export class Nav extends React.Component {
    public render(): React.ReactNode {
        return <Navbar className="navbar">
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>
                    <div id="logo">AllezGo</div>
                </Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <a href="mailto:info@allezgo.com">
                    <Button
                        className="bp3-minimal"
                        intent="primary"
                        text="Contact"
                    />
                </a>
            </Navbar.Group>
        </Navbar>
    }
}