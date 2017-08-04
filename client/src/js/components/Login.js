import React from "react";
import {withRouter} from "react-router-dom";
import {serverAddress} from "../serverConfig";

class Login extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            isAuthorized: localStorage.getItem("isAuthorized"),
            error: null,
            token: localStorage.getItem("token")
        };
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);


    }

    componentDidMount() {
        if (this.state.token) {
            fetch(`${serverAddress}/vcelin/tokenValidation`, {
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

        fetch(`${serverAddress}/vcelin/api/login`, {
            method: "POST",
            body: data,
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json"}
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((json) => {
                        this.setState({"loginInfo": json, error: null});

                        let time = new Date();
                        time.setTime(time.getTime() + (24 * 60 * 60 * 1000));
                        localStorage.setItem("token", json.token);
                        localStorage.setItem("isAuthorized", true);
                        localStorage.setItem("userName", json.user.name);
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

    renderError() {
        if (!this.state.error) {
            return null;
        }

        return <div style={{color: 'red'}}>{this.state.error}</div>;
    }

    render() {
        if (this.state.isAuthorized) {
            return (
                <div style={{float: "right"}}>

                    <ul className="nav navbar-nav">
                        <li style={{paddingTop: "15px", fontSize: "22px", marginRight: "20px"}}>
                            <span>Welcome {localStorage.getItem("userName")}</span>
                        </li>
                        <li style={{paddingTop: "10px"}}>
                            <button className="btn btn-default" onClick={this.handleLogoutClick}>
                                Logout
                            </button>

                        </li>
                    </ul>
                </div>
            )
        }
        return (
            <div style={{float: "right"}}>
                <form className="navbar-form">
                    <div className="input-group">
                        <input className="form-control" type="text" value={this.state.email} placeholder="Email"
                               onChange={this.handleChangeEmail}/>
                    </div>
                    <div className="input-group">
                        <input className="form-control" type="password" value={this.state.password}
                               placeholder="Password" onChange={this.handleChangePassword}/>
                    </div>
                    <button className="btn btn-primary" onClick={this.handleLoginClick}>Login</button>
                    {this.renderError()}
                </form>
            </div>
        )
    }

}

export default withRouter(Login);
