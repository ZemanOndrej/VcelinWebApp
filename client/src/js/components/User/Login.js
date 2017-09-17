import React from "react";
import {withRouter} from "react-router-dom";
import {serverAddress} from "../../serverConfig";
import Link from "react-router-dom/es/Link";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthorized: localStorage.getItem("isAuthorized"),
            error: null,
            token: localStorage.getItem("token"),
            username: localStorage.getItem("userName"),
            password: "",
            email: ""
        };
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);

    }

    componentDidMount() {
        if (this.state.token) {
            fetch(`http://${serverAddress}/vcelin/tokenValidation`, {
                method: "POST",
                mode: "cors",
                cache: "default",
                headers: {"token": this.state.token}
            })
                .then(response => {
                    if (response.status === 401) {
                        localStorage.clear();
                        this.setState({isAuthorized: false})
                    }
                });
        }

    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value})
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value})
    }

    handleLoginClick(event) {
        event.preventDefault();

        let data = JSON.stringify({
            "Password": this.state.password,
            "Email": this.state.email
        });

        fetch(`http://${serverAddress}/vcelin/api/login`, {
            method: "POST",
            body: data,
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json"}
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((json) => {
                        this.setState({email: "", title: "", error: null});

                        let time = new Date();
                        time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
                        localStorage.setItem("token", json.token);
                        localStorage.setItem("isAuthorized", true);
                        localStorage.setItem("userName", json.user.name);
                        localStorage.setItem("userEmail", json.user.email);
                        localStorage.setItem("userId", json.user.ID);
                        localStorage.setItem("expiration", time);
                        this.setState({isAuthorized: true});
                        this.props.updateHeader();
                        this.props.history.go(0)
                    });
                }

                this.setState({error: "Email or Password are wrong"})
            });
    }

    handleLogoutClick() {

        localStorage.clear();
        this.setState({isAuthorized: false});
        this.props.history.go(0)

    }

    render() {
        let mobile = window.matchMedia("(max-width: 767px)");

        return (
            <div className="navPersonalSection">
                {this.state.isAuthorized ?
                    <ul className="nav navbar-nav navbar-right">
                        <li><p className="navbar-text">Logged in as {this.state.username}</p></li>
                        <li><Link data-toggle={mobile.matches ? "collapse" : null} data-target="#navbar-collapseId"
                                  to="/vcelin/options"><img src="https://i.imgur.com/RU7Nj69.png" width="15"
                                                            height="15"/> </Link></li>
                        <li>
                            <button type="submit" className="btn btn-default navbar-btn"
                                    data-toggle={mobile.matches ? "collapse" : null} data-target="#navbar-collapseId"
                                    onClick={this.handleLogoutClick}>
                                Logout
                            </button>
                        </li>
                    </ul>
                    :
                    <form className="navbar-form navbar-right">
                        <div className="form-group">
                            <input type="text" className="form-control" onChange={this.handleChangeEmail}
                                   value={this.state.email} placeholder="Email"/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" onChange={this.handleChangePassword}
                                   value={this.state.password} placeholder="Password"/>
                        </div>
                        <button type="submit" className="btn btn-default" onClick={this.handleLoginClick}>Login</button>
                        {this.state.error ? <div style={{color: 'red'}}>{this.state.error}</div> : null}
                    </form>}
            </div>);
    }
}

export default withRouter(Login);
