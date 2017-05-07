/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import Post from "./Post";
export default class PostList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        let token = localStorage.getItem("token");
        if (token) {
            fetch("http://localhost:1337/vcelin/api/posts", {
                method: "GET",
                headers: {"token": token}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                            .then((json) => {
                                this.setState({"data": json.data});
                            });
                    }
                });
        }
    }

    render() {
        if (!this.state.data) {
            return (<div>
                No posts ;(
            </div>)
        }
        return (
            <div>
                <h2>Posts</h2>
                {this.state.data.map((object, i)=>{
                    return <Post data={object} key={i} />;
                })}
            </div>
        )
    }


}
