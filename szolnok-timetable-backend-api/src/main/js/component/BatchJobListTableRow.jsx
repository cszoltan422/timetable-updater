'use strict';

const React = require('react');
const Button = require('react-bootstrap').Button;
const Toast = require('react-bootstrap').Toast;
const Badge = require('react-bootstrap').Badge;
const client = require('../client');

class BatchJobListTableRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            disableButtons: false,
            showAlert: false
        };

        this.promote = this.promote.bind(this);
        this.completedJobAndNotPromotedYet = this.completedJobAndNotPromotedYet.bind(this);
        this.failedJob = this.failedJob.bind(this);
        this.notFinishedJob = this.notFinishedJob.bind(this);
        this.getLayoutConfig = this.getLayoutConfig.bind(this);
        this.setShow = this.setShow.bind(this);
    }

    promote(item, id) {
        if (this.state.disableButtons) {
            return;
        }
        this.setState({disableButtons: true});

        client({
            method: 'POST',
            path: '/admin/api/jobs/' + id + '/promote',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
        }).done(response => {
            this.setState({disableButtons: false, showAlert: true});
        });
    }

    setShow(boolean) {
        this.setState({
            showAlert: boolean
        })
    }

    render() {
        let toRender;
        if (this.state.showAlert) {
            toRender =
                <Toast show={this.state.showAlert} onClose={() => this.setShow(false)}>
                    <Toast.Header>
                        <img className="rounded mr-2" alt="" />
                        <strong className="mr-auto">Production Promotion</strong>
                        <small>Now</small>
                    </Toast.Header>
                    <Toast.Body>Batch process was successfully promoted to Production!</Toast.Body>
                </Toast>
        } else {
            let {rowClass, actionButton} = this.getLayoutConfig();
            toRender =
                <tr key={this.props.job.id}
                    className={rowClass}>
                    <td>{this.props.job.id}</td>
                    <td>
                        {this.props.job.type}
                        <span className="promoted-job-badge">
                            <Badge className={this.props.job.promoted ? "show" : "hide"} variant="primary">Promoted</Badge>
                        </span>
                    </td>
                    <td>{this.props.job.parameters}</td>
                    <td>{this.props.job.startTime}</td>
                    <td>{this.props.job.finishTime}</td>
                    <td>{this.props.job.finished ? "YES" : "NO"}</td>
                    <td>{this.props.job.status}</td>
                    <td>{actionButton}</td>
                </tr>
        }
        return toRender;
    }

    getLayoutConfig() {
        let rowClass = "";
        let actionButton;
        if (this.notFinishedJob(this.props.job)) {
            rowClass = "bg-success progress-bar-striped";
            actionButton = <p/>
        } else if (this.failedJob(this.props.job)) {
            rowClass = "bg-danger progress-bar-striped";
            actionButton =
                <Button variant="danger" type="submit">
                    Retry
                </Button>
        } else if (this.completedJobAndNotPromotedYet(this.props.job)) {
            actionButton =
                <Button variant="primary" type="submit" onClick={(item) => this.promote(item, this.props.job.id)}
                        disabled={this.state.disableButtons}>
                    Promote to Prod
                </Button>
        }
        return {rowClass, actionButton};
    }

    completedJobAndNotPromotedYet(job) {
        return job.finished && job.status === 'COMPLETED' && !job.promoted && job.promotable;
    }

    failedJob(job) {
        return job.finished && job.status !== 'COMPLETED';
    }

    notFinishedJob(job) {
        return !job.finished;
    }
}

module.exports = BatchJobListTableRow;