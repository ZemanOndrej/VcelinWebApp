import React from "react";

export default class Login extends React.Component{


    constructor(props) {
        super(props);

        this.state = {
            error: null
        };

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    handleChangeEmail(event){
        this.setState({email: event.target.value})
    }

    handleChangePassword(event){
        this.setState({password: event.target.value})
    }

    render(){
        return (
            <div>
                <form onSubmit={this.handleCreate.bind(this)}>
                    <input type="text" value={this.state.email} placeholder="Email" onChange={this.handleChangeEmail}  />
                    <input type="password" value={this.state.password}  placeholder="Password" onChange={this.handleChangePassword}  />

                    <button>Login</button>
                </form>
            </div>

        )
    }


    handleCreate(event) {
        event.preventDefault();

        let data = JSON.stringify({
            "Password": this.state.password,
            "Email": this.state.email
        });

        fetch("http://localhost:1337/vcelin/api/login",{
            method: "POST",
            body: data,
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json"}
        })
            .then((response)=>{
            if (response.ok){
                this.setState({"authorized":true});
                return response.json().then((json)=>{
                    this.setState({login:json});
                });
            }
        });


        console.log(this.state.authorized);
    }

    renderError() {
        if (!this.state.error) { return null; }

        return <div style={{ color: 'red' }}>{this.state.error}</div>;
    }


}
