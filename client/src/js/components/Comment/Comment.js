/**
 * Created by zeman on 08-May-17.
 */
import React from "react";
import UpdateForm from "../UpdateForm";
import {formatTimeSince} from "../../util";

export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showModal: false};
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

    }

    closeModal() {
        this.setState({showModal: false});
    }

    openModal() {
        this.setState({showModal: true});
    }

    render() {
        let data = this.props.data;
        let userId = parseInt(localStorage.getItem("userId"));

        return (
            <div className="commentSection generalPadding">
                <h4>
                    {data.message}
                </h4>

                <span className="spanInfo">
                    {formatTimeSince(data.CreatedAt)} ago
                </span>
                <span className="spanInfo">
                    Sent by:
                    {data.User.name}
                </span>
                {/*admin control with id 1 */}
                {userId === data.User.ID || userId === 1 ?
                    <a onClick={this.openModal} className="spanClick">Edit </a> : null}

                {this.state.showModal ?
                    <UpdateForm closeModal={this.closeModal} updateHandler={this.props.updateCommentHandler}
                                deleteHandler={this.props.deleteCommentHandler}
                                data={data} type="comment"/> : null}

            </div>
        )
    }

}