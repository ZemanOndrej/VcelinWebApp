/**
 * Created by Ondrej on 14/07/2017.
 */
import React from "react";
import {serverAddress} from "../../serverConfig";
import ImageGallery from "./ImageGallery";
export default class ArticleDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {token: localStorage.getItem("token"), images: []};
    }

    componentDidMount() {

        if (this.state.token) {
            fetch(`${serverAddress}/vcelin/api/articles/${this.props.match.params.articleId}`, {
                method: "GET",
                headers: {}
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                            .then((json) => {
                                this.setState({data: json.data});

                                for (let i = 0; i < json.data.Images.length; i++) {
                                    console.log(json.data.Images[i]);
                                    fetch(`${serverAddress}/vcelin/api/images/${json.data.Images[i].ID}`, {
                                        method: "GET",
                                    }).then((response) => {
                                        if (response.ok) {
                                            return response.json().then(json => {
                                                this.setState({images: [...this.state.images, json.data]})
                                            });
                                        }
                                    })

                                }

                            });
                    } else {
                        this.setState({err: "server error: " + response.status})
                    }
                });
        }
    }

    render() {
        let data = this.state.data;
        if (data) {
            return (
                <div style={{padding: "10px 20px 10px 20px"}}>
                    <div>
                        <div className="article">
                            <h3>{data.title}</h3>
                            <p>{data.text}</p>
                            <span>{data.CreatedAt}</span>
                            <span>sent:{data.User.name}</span>
                        </div>
                        <ImageGallery images={this.state.images}/>
                    </div>
                </div>
            )
        } else {
            return (<div
                style={{padding: "10px 20px 10px 20px"}}><p>{this.state.err ? this.state.err : "loading.."}</p>
            </div>)
        }


    }
}