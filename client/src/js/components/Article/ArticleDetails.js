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
        this.handleImageDelete = this.handleImageDelete.bind(this);
    }

    handleImageDelete(index) {
        let arr = this.state.images;
        let removeIndex = arr.findIndex(o => o.FileName === index);


        fetch(`${serverAddress}/vcelin/api/images/${this.state.images[removeIndex].ID}`, {
            method: 'DELETE',
            mode: "cors",
            cache: "default",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token"),
            },
        });
        arr.splice(removeIndex, 1);
        this.setState({
            images: arr
        });
    }

    componentDidMount() {

        fetch(`${serverAddress}/vcelin/api/articles/${this.props.match.params.articleId}`, {
            method: "GET",
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                        .then((json) => {
                            this.setState({data: json.data});

                            for (let i = 0; i < json.data.Images.length; i++) {
                                fetch(`${serverAddress}/vcelin/api/images/${json.data.Images[i].ID}`, {
                                    method: "GET",
                                }).then((response) => {
                                    if (response.ok) {
                                        return response.json().then(json => {
                                            let image = json.image;
                                            image.data = json.data;
                                            this.setState({images: [...this.state.images, image]});
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
                        <ImageGallery handleImageDelete={this.handleImageDelete}
                                      images={this.state.images}/>
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