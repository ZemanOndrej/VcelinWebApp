import React from "react";
import {withRouter} from "react-router-dom";

class Login extends React.Component {
    constructor(props) {
        super(props);

        let authorized = localStorage.getItem("isAuthorized");

        this.state = {
            error: null,
            isAuthorized: authorized
        };
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleLoginClick = this.handleLoginClick.bind(this);
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

        fetch("http://ozeman.tk/vcelin/api/login", {
            method: "POST",
            body: data,
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json"}
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((json) => {
                        this.setState({"loginInfo": json, "isAuthorized": true, error: null});
                        localStorage.setItem("token", json.token);
                        localStorage.setItem("isAuthorized", true);
                        localStorage.setItem("userName", json.user.name);
                        localStorage.setItem("userId", json.user.ID);
                        this.props.updateHeader();
                    });
                }

                this.setState({error: "Email or Password are wrong"})
            });
    }

    handleLogoutClick() {

        localStorage.removeItem("token");
        localStorage.removeItem("isAuthorized");
        this.props.history.push("/vcelin");
        this.setState({isAuthorized: false})

    }

    renderError() {
        if (!this.state.error) {
            return null;
        }

        return <div style={{color: 'red'}}>{this.state.error}</div>;
    }

    render() {

        const isAuthorized = this.state.isAuthorized;
        if (isAuthorized) {
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


