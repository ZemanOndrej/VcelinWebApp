/**
 * Created by Ondrej on 10/06/2017.
 */
import React from "react";

export default class UserListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: parseInt(localStorage.getItem("userId"))
        };

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleDelete() {
        this.props.handleDelete(this.props.userData.ID);
    }

    handleEdit() {
        this.props.handleEdit(this.props.userData.ID);
    }

    render() {
        let user = this.props.userData;


        return (
            <div className="generalPadding articleSection">
                <span className="spanInfo">
                    {user.ID}
                </span>
                <span className="spanInfo">
                    {user.name}
                </span>
                <span className="spanInfo">
                    {user.email}
                </span>
                <span className="spanInfo">
                    {user.CreatedAt}
                </span>

                {this.state.userId === 1 ?
                    <span className="spanClick spanInfo underlined" onClick={this.handleDelete}>Delete</span>
                    : null}
                {/*{this.state.userId === 1 ?*/}
                {/*<span className="spanClick spanInfo underlined" onClick={this.handleEdit}>Edit</span>*/}
                {/*: null}*/}


            </div>
        )
    }
}