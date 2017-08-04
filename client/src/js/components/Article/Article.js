/**
 * Created by Ondrej on 10/06/2017.
 */
import React from "react";
import Link from "react-router-dom/es/Link";
import ImageGallery from "./ImageGallery";
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

        this.setState({isOpen: !this.state.isOpen});
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
                <span className="spanInfo">
                    Photos: {data.Images.length}
                </span>

                {this.props.token ? <Link to={"/vcelin/articles/" + data.ID}>Details</Link> : null}

                <Collapse isOpened={this.props.articleOpen === this.props.index}>
                    <div>
                        <p style={{margin: "15px 0 10px 20px"}}>
                            {data.text}
                        </p>
                        <ImageGallery showDelete={false} images={this.props.data.Images}/>
                    </div>
                </Collapse>
            </div>
        )
    }
}