/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Link from "react-router-dom/es/Link";
import UpdateForm from "./UpdateForm";
export default class Post extends React.Component {

    constructor(props){
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

    render(){
        let data = this.props.data;
        let userId = parseInt(localStorage.getItem("userId"));
        return(
            <div style={{padding:"10px 20px 10px 20px"}}>
                <h3>
                {data.message}
                </h3>

                <span>
                    {data.CreatedAt}
                </span>
                <span>sent:
                    {data.User.name}
                </span>
                {this.props.link ? <Link to={"/posts/" + data.ID}>Comments</Link> : null}
                {/*admin control with id 1 */}
                {userId === data.User.ID || userId === 1 ?
                    <a onClick={this.editClickModal} >Edit </a>:null}

                {this.state.showModal ?
                    <UpdateForm closeModal={this.closeModal} updateHandler={this.props.updatePostHandler}
                                deleteHandler={this.props.deletePostHandler}
                                data={data} type="post"/> : null}
            </div>
        )
    }
}