/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Post from "./Post";
import PostForm from "./PostForm";
import {removeDuplicates} from "../../util";
import {serverAddress} from "../../serverConfig";

export default class PostList extends React.Component {

    constructor(props) {
        super(props);
        this.newPostSendHandler = this.newPostSendHandler.bind(this);
        this.deletePostHandler = this.deletePostHandler.bind(this);
        this.updatePostHandler = this.updatePostHandler.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.loadPosts = this.loadPosts.bind(this);


        this.newPostReceiveHandler = this.newPostReceiveHandler.bind(this);
        window.addEventListener("scroll", this.handleScroll);
        const token = localStorage.getItem("token");
        const socket = new WebSocket(`ws://${serverAddress}/vcelin/postListSocket/${token}`);

        this.state = {
            token: token,
            page: 0,
            data: [],
            socket: socket
        };


        this.state.socket.addEventListener('message', this.newPostReceiveHandler);
    }

    componentDidMount() {
        this.loadPosts();

        if (this.props.location.state) {
            this.setState({postError: this.props.location.state.error});
            this.props.history.replace({
                pathname: '/vcelin/posts',
                state: {}
            });

        }
    }

    newPostReceiveHandler(event) {
        this.setState({data: [JSON.parse(event.data), ...this.state.data]});
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    loadPosts() {
        if (this.state.token) {
            fetch(`http://${serverAddress}/vcelin/api/postsPage/${this.state.page}`, {
                method: "GET",
                headers: {"token": this.state.token}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                            .then((json) => {
                                if (json.data) {
                                    let data = this.state.data.concat(json.data);
                                    data = removeDuplicates(data);

                                    this.setState({"data": data});
                                } else {
                                    this.setState({error: json.message, lastPage: true})
                                }
                            });
                    }
                    else if (response.status === 401) {
                        localStorage.clear();
                        this.props.history.push("/vcelin")
                    }
                });
        }
    }

    handleScroll() {

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            if (!this.state.lastPage) {
                this.setState({page: this.state.page + 1});
                this.loadPosts();
            }
        }
    }

    newPostSendHandler(e) {
        this.state.socket.send(JSON.stringify({token: this.state.token, message: e}));
    }

    deletePostHandler(postId) {

        let data = this.state.data;
        data = data.filter(c => c.ID !== postId);
        this.setState({data: data});
    }

    updatePostHandler(event) {
        let data = this.state.data;
        for (let post of this.state.data) {
            if (post.ID === event.ID) {
                post.message = event.Message;
                break;
            }
        }
        this.setState({data: data})
    }

    render() {

        if (!this.state.token) {
            return (<div> Please Login</div>);
        }
        let posts = null;

        if (!this.state.data) {
            posts = <div>No posts ;(</div>
        } else {
            posts = this.state.data.map((object, i) => {
                return <Post data={object} key={i} link={true}
                             deletePostHandler={this.deletePostHandler}
                             updatePostHandler={this.updatePostHandler}/>;
            })
        }
        return (
            <div>
                {this.state.postError ?
                    <div className="alert alert-danger"> ERROR: {this.state.postError}</div> : null}
                <h1 className="heading">Posts</h1>
                <PostForm newPostHandler={this.newPostSendHandler}/>
                <div id="postList">
                    {posts}
                </div>
                <div>

                    {this.state.error ?
                        (<div className="alert alert-info">{this.state.error}</div>)
                        : null
                    }

                </div>
            </div>
        )
    }
}
