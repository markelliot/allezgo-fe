import {
    Button,
    Callout,
    Checkbox,
    ControlGroup,
    H4,
    H5,
    InputGroup,
    Intent,
    Label,
    ProgressBar,
} from '@blueprintjs/core'
import React, { ChangeEventHandler, ReactNode } from 'react'
import './pelotonToGarmin.scss'

interface SyncResult {
    activityDate: string
    title: string
    description: string
    pelotonLink: string
    garminLink: string
    wasCreated: boolean
}

interface PelotonToGarminSyncResult {
    error?: string
    result?: SyncResult[]
}

interface PelotonToGarminState {
    pelotonEmail?: string
    pelotonPassword?: string
    garminEmail?: string
    garminPassword?: string
    garminPelotonGearName?: string
    todayOnly: boolean
    rememberMyCredentials: boolean
    result?: PelotonToGarminSyncResult
    requestInFlight: boolean
}

export class PelotonToGarmin extends React.Component<
    Record<string, never>,
    PelotonToGarminState
> {
    public state: PelotonToGarminState = {
        todayOnly: false,
        rememberMyCredentials: false,
        requestInFlight: false,
    }

    public componentDidMount = (): void => {
        const storage = localStorage.getItem('peloton-to-garmin')
        if (storage) {
            const stashedState = JSON.parse(storage)
            this.setState(stashedState)
        }
    }

    public componentDidUpdate = (): void => {
        if (this.state.rememberMyCredentials) {
            localStorage.setItem(
                'peloton-to-garmin',
                JSON.stringify({
                    pelotonEmail: this.state.pelotonEmail,
                    pelotonPassword: this.state.pelotonPassword,
                    garminEmail: this.state.garminEmail,
                    garminPassword: this.state.garminPassword,
                    garminPelotonGearName: this.state.garminPelotonGearName,
                    todayOnly: this.state.todayOnly,
                    rememberMyCredentials: true,
                }),
            )
        } else {
            localStorage.removeItem('peloton-to-garmin')
        }

        const element = document.getElementById('result')
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    public render(): ReactNode {
        const form = (
            <>
                <H4>Synchronize Peloton Rides with Garmin Connect</H4>
                <div className="description">
                    We'll query the Peloton API, find your last 30 days of
                    rides, and for each ride create a corresponding ride in
                    Garmin Connect if one does not already exist. We skip any
                    non-bike activities, and our system considers an activity
                    that starts in Garmin Connect +/- 2 minutes within the start
                    of the Peloton ride to be the same activity.
                </div>
                <div className="credentials">
                    <H5>Login Credentials</H5>
                    <div className="note">
                        We do not store, log or otherwise record your password.
                        We may log your email for debugging. By using this
                        system, you are explicitly agreeing that your
                        credentials may be used to read your Peloton data, read
                        your Garmin Connect activity data, and write data to
                        Garmin Connect on your behalf.
                    </div>
                    <Label>
                        Peloton Email Address
                        <InputGroup
                            placeholder="Enter the email address you use to login to Peloton"
                            value={this.state.pelotonEmail}
                            onChange={this.updatePelotonEmail}
                        />
                    </Label>
                    <Label>
                        Peloton Password
                        <InputGroup
                            placeholder="Enter the password you use to login to Peloton"
                            value={this.state.pelotonPassword}
                            onChange={this.updatePelotonPassword}
                            type="password"
                        />
                    </Label>
                    <Label>
                        Garmin Email Address
                        <InputGroup
                            placeholder="Enter the email address you use to login to Garmin Connect"
                            value={this.state.garminEmail}
                            onChange={this.updateGarminEmail}
                        />
                    </Label>
                    <Label>
                        Garmin Password
                        <InputGroup
                            placeholder="Enter the password you use to login to Garmin Connect"
                            value={this.state.garminPassword}
                            onChange={this.updateGarminPassword}
                            type="password"
                        />
                    </Label>
                    <Label>
                        Garmin Gear Name for Peloton Bike (this should
                        correspond to the "Brand &amp; Model" field of your
                        custom gear in Garmin)
                        <InputGroup
                            placeholder="Enter the gear brand and model of your Peloton bike in Garmin"
                            value={this.state.garminPelotonGearName}
                            onChange={this.updateGarminPelotonGearName}
                        />
                    </Label>
                    <Checkbox
                        checked={this.state.todayOnly}
                        label="Only Synchronize Today's Rides"
                        onChange={this.toggleTodayOnly}
                    />
                    <Checkbox
                        checked={this.state.rememberMyCredentials}
                        label="Remember my credentials"
                        onChange={this.toggleRememberMyCredentials}
                    >
                        <div className="note">
                            If you check the 'Remember my credentials' box on
                            the form, we will save them in your browser. Do not
                            use this feature on a shared computer.
                        </div>
                    </Checkbox>

                    <ControlGroup fill={true}>
                        <Button
                            disabled={
                                !this.isSubmittable() ||
                                this.state.requestInFlight
                            }
                            text="Synchronize Peloton Rides to Garmin"
                            large={true}
                            intent={Intent.PRIMARY}
                            onClick={this.submit}
                        />
                    </ControlGroup>
                </div>
            </>
        )

        const results = !this.state.result ? (
            <></>
        ) : (
            this.formatResults(this.state.result)
        )

        const error = !this.state.result ? (
            <></>
        ) : (
            this.formatError(this.state.result)
        )

        return (
            <div className="main">
                {form}
                {this.state.requestInFlight ? (
                    <ProgressBar intent={Intent.PRIMARY} />
                ) : (
                    <></>
                )}
                {results}
                {error}
            </div>
        )
    }

    private numDaysToSync = () => (this.state.todayOnly ? 1 : 30)

    private formatResults = (result: PelotonToGarminSyncResult) => {
        if (result.result) {
            return (
                <div id="result">
                    <H5>
                        Your rides over the last {this.numDaysToSync()} days
                    </H5>
                    {result.result.length == 0 ? (
                        <div className="syncResults">
                            No Peloton rides found during this period.
                        </div>
                    ) : (
                        <></>
                    )}
                    {result.result.map((sr) => (
                        <div className="syncResults">
                            <div className="date">{sr.activityDate}</div>
                            <div className="links">
                                <a href={sr.pelotonLink}>Peloton</a>
                                <a href={sr.garminLink}>
                                    Garmin{sr.wasCreated ? ' (new)' : ''}
                                </a>
                            </div>
                            <div className="description">
                                <strong>{sr.title}</strong>
                                {sr.description}
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
        return <></>
    }

    private formatError = (result: PelotonToGarminSyncResult) => {
        if (result.error) {
            return (
                <div className="error">
                    <Callout intent={Intent.DANGER} title="Error">
                        {result.error}
                    </Callout>
                </div>
            )
        }
        return <></>
    }

    private isSubmittable = () => {
        return (
            this.state.pelotonEmail &&
            this.state.pelotonPassword &&
            this.state.garminEmail &&
            this.state.garminPassword &&
            this.state.garminPelotonGearName
        )
    }

    private updatePelotonEmail: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        this.setState({ ...this.state, pelotonEmail: event.target.value })
    }

    private updatePelotonPassword: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        this.setState({ ...this.state, pelotonPassword: event.target.value })
    }

    private updateGarminEmail: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        this.setState({ ...this.state, garminEmail: event.target.value })
    }

    private updateGarminPassword: ChangeEventHandler<HTMLInputElement> = (
        event,
    ) => {
        this.setState({ ...this.state, garminPassword: event.target.value })
    }

    private updateGarminPelotonGearName: ChangeEventHandler<HTMLInputElement> =
        (event) => {
            this.setState({
                ...this.state,
                garminPelotonGearName: event.target.value,
            })
        }

    private toggleTodayOnly: ChangeEventHandler<HTMLInputElement> = () => {
        this.setState({
            ...this.state,
            todayOnly: !this.state.todayOnly,
        })
    }

    private toggleRememberMyCredentials: ChangeEventHandler<HTMLInputElement> =
        () => {
            this.setState({
                ...this.state,
                rememberMyCredentials: !this.state.rememberMyCredentials,
            })
        }

    private submit = async () => {
        this.setState({ ...this.state, requestInFlight: true })
        const result = await fetch(
            'https://api.allezgo.io/api/synchronize/peloton-to-garmin',
            {
                method: 'PUT',
                body: JSON.stringify({
                    pelotonEmail: this.state.pelotonEmail,
                    pelotonPassword: this.state.pelotonPassword,
                    garminEmail: this.state.garminEmail,
                    garminPassword: this.state.garminPassword,
                    garminPelotonGearName: this.state.garminPelotonGearName,
                    numDaysToSync: this.numDaysToSync(),
                }),
            },
        )
        this.setState({
            ...this.state,
            requestInFlight: false,
            result: await result.json(),
        })
    }
}
