import React from "react";
import UserListItem from "./UserListItem";
import {serverAddress} from "../../serverConfig";

export default class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
        };

        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(id) {
        if (this.state.token) {
            fetch(`http://${serverAddress}/vcelin/api/users/${id}`, {
                method: 'DELETE',
                mode: "cors",
                cache: "default",
                headers: {
                    token: this.state.token,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        response.json().then(j => {
                                this.props.handleUserDelete(id);
                                this.setState({error: ""})
                            }
                        )
                    } else {
                        response.json().then(j => this.setState({error: j.message}))
                    }
                });
        }
    }


    render() {

        let users = null;
        if (!this.props.userList) {
            users = <div>No Users;(</div>
        } else {
            users = this.props.userList.map((object, i) => {
                return <UserListItem userData={object} key={i} handleDelete={this.handleDelete}/>
            })
        }
        return (
            <div>
                {this.state.error ?
                    <div className="alert alert-danger"> ERROR: {this.state.error}</div> : null}
                <div className="mainHeading">
                    <h1>Users</h1>
                </div>
                {users}
            </div>
        )
    }
}