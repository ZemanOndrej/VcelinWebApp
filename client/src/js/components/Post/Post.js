/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Link from "react-router-dom/es/Link";
import UpdateForm from "../UpdateForm";
import {formatTimeSince} from "../../util";

export default class Post extends React.Component {

    constructor(props) {
        super(props);
        this.state = {showModal: false};
        this.editClickModal = this.editClickModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.setState({showModal: false})
    }

    editClickModal() {
        this.setState({showModal: true})
    }

    render() {
        let data = this.props.data;
        let userId = parseInt(localStorage.getItem("userId"));
        return (
            <div className={(this.props.link ? "postSection" : "postTextAlign") + " postDetails generalPadding"}>
                <div>
                    <h3>
                        {data.message}
                    </h3>

                    <span className="spanInfo">
                        {formatTimeSince(data.CreatedAt)} ago
                    </span>

                    <span className="spanInfo">
                        Sent by :{data.User.name}
                    </span>
                    {/*admin control with id 1 */}
                    {userId === data.User.ID || userId === 1 ?
                        <a className="buttonMargin" onClick={this.editClickModal}>Edit </a> : null}

                    {this.props.link ? <Link to={"/vcelin/posts/" + data.ID}>Comments: {data.commentCount}</Link> :
                        <span className="spanInfo">
                            Comments: {data.commentCount}
                        </span>}

                </div>

                {this.state.showModal ?
                    <UpdateForm closeModal={this.closeModal} updateHandler={this.props.updatePostHandler}
                                deleteHandler={this.props.deletePostHandler}
                                data={data} type="post"/> : null}
            </div>
        )
    }
}