/**
 * Created by Ondrej on 10/06/2017.
 */
import React from "react";
import Link from "react-router-dom/es/Link";
import ImageGallery from "./ImageGallery";
import {serverAddress} from "../../serverConfig";
import {Collapse} from "react-collapse";
import {formatTimeSince} from "../../util";

export default class Article extends React.Component {

    constructor(props) {
        super(props);
        this.openArticle = this.openArticle.bind(this);
        this.state = {isOpen: false, images: []}
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data.images) {
            this.setState({isOpen: nextProps.index === nextProps.articleOpen, images: nextProps.data.images});
        } else {
            this.setState({isOpen: nextProps.index === nextProps.articleOpen});

        }
    }

    openArticle() {

        if (this.state.isOpen) {
            this.setState({isOpen: false});
        } else {
            this.setState({isOpen: true});
            console.log(this.props.data.Images.length !== this.state.images.length, this.props.data.Images.length, this.state.images.length);
            if (this.props.data.Images.length !== this.state.images.length) {
                for (let i = 0; i < this.props.data.Images.length; i++) {
                    fetch(`${serverAddress}/vcelin/api/images/${this.props.data.Images[i].ID}`, {
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
            }

        }
        this.props.handleOpenArticle(!this.state.isOpen, this.props.index)
    }

    render() {
        let data = this.props.data;

        return (
            <div className="generalPadding articleSection" onClick={this.openArticle}>
                <h3>
                    {data.title}
                </h3>
                <span className="spanInfo">
                    {formatTimeSince(data.CreatedAt)} ago
                </span>
                <span className="spanInfo">
                    Sent by :
                    {data.User.name}
                </span>

                {this.props.token ? <Link to={"/vcelin/articles/" + data.ID}>Details</Link> : null}

                <Collapse isOpened={this.props.articleOpen === this.props.index}>
                    <div>
                        <p style={{margin: "15px 0 10px 20px"}}>
                            {data.text}
                        </p>
                        <ImageGallery showDelete={false} images={this.state.images}/>
                    </div>
                </Collapse>
            </div>
        )
    }
}