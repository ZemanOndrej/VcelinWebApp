/**
 * Created by Ondrej on 14/07/2017.
 */
import React from "react";
import {serverAddress} from "../../serverConfig";
import ImageGallery from "./ImageGallery";
import {formatTimeSince} from "../../util";
import ImageInput from "./ImageInput";

export default class ArticleDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem("token"),
            images: [],
            newImages: [],
            isEditing: false,
            buttonsEnabled: true,
            imagesToDelete: []
        };

        this.handleImageDelete = this.handleImageDelete.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleArticleDelete = this.handleArticleDelete.bind(this);
        this.handleUpdateCancel = this.handleUpdateCancel.bind(this);
        this.handleNewImage = this.handleNewImage.bind(this);
        this.enableButtons = this.enableButtons.bind(this);
    }

    componentDidMount() {

        fetch(`http://${serverAddress}/vcelin/api/articles/${this.props.match.params.articleId}`, {
            method: "GET"
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                        .then((json) => {
                            this.setState({
                                data: json.data,
                                title: json.data.title,
                                text: json.data.text,
                                images: json.data.Images
                            });

                        });
                } else {
                    this.props.history.push({
                        pathname: "/vcelin/articles",
                        state: {
                            error: response.status + ", Could not find Article with id: " + this.props.match.params.articleId
                        }
                    })
                }
            });

    }

    handleArticleDelete(event) {
        event.preventDefault();

        fetch(`http://${serverAddress}/vcelin/api/articles/${this.state.data.ID}`, {
            method: "DELETE",
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json", "token": localStorage.getItem("token")}
        })
            .then((response) => {
                if (response.ok) {
                    this.props.history.push("/vcelin/articles")

                }

            });
    }

    handleTextChange(event) {
        this.setState({text: event.target.value})
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value})

    }

    handleImageDelete(index) {

        // yea this is not a nice code
        let newImgIndex = this.state.newImages.findIndex((obj) => {
            return obj.filename === index;
        });
        let deleteImgIndex = this.state.imagesToDelete.findIndex((obj) => {
            return obj.filename === index;
        });

        if (deleteImgIndex === -1 && newImgIndex > -1) {
            this.setState({
                newImages: this.state.newImages.filter((obj) => {
                    return obj.filename !== index
                }),
                imagesToDelete: [...this.state.imagesToDelete, {filename: index}],
            });
        } else if (deleteImgIndex === -1 && newImgIndex === -1) {
            this.setState({
                imagesToDelete: [...this.state.imagesToDelete, {filename: index, isOldImage: true}],
            });

        } else if (deleteImgIndex > -1 && this.state.imagesToDelete[deleteImgIndex].isOldImage) {

            this.setState({
                imagesToDelete: this.state.imagesToDelete.filter((obj) => {
                    return obj.filename !== index
                })
            });

        } else if (deleteImgIndex > -1) {
            this.setState({
                newImages: [...this.state.newImages, {filename: index}],
                imagesToDelete: this.state.imagesToDelete.filter((obj) => {
                    return obj.filename !== index
                })
            });

        }
    }

    handleEditClick() {

        if (this.state.isEditing) {
            fetch(`http://${serverAddress}/vcelin/api/articles/${this.state.data.ID}`, {
                method: 'PUT',
                mode: "cors",
                cache: "default",
                headers: {
                    "Content-Type": "application/json",
                    "token": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    Title: this.state.title,
                    Text: this.state.text,
                    NewImages: this.state.newImages,
                    DeleteImages: this.state.imagesToDelete.map((o) => {
                        return o.filename
                    })
                })
            }).then((response) => {
                    if (response.ok) {
                        let imagesNamesArray = this.state.imagesToDelete.map(o => o.filename);

                        let article = this.state.data;
                        article.title = this.state.title;
                        article.text = this.state.text;
                        this.setState({
                            data: article,
                            images: this.state.images.filter(o => imagesNamesArray.indexOf(o.filename) === -1),
                            imagesToDelete: [],
                            newImages: []
                        });
                    } else {
                        this.handleUpdateCancel()
                    }
                }
            );
            this.setState({isEditing: false})
        }
        else {
            this.setState({isEditing: true, text: this.state.data.text})

        }
    }

    enableButtons(value) {
        this.setState({enableButtons: value})
    }

    handleUpdateCancel() {

        let imagesToDelete = this.state.newImages
            .concat(this.state.imagesToDelete.filter(o => !o.isOldImage))
            .map(o => o.filename);

        if (imagesToDelete.length > 0) {
            fetch(`http://${serverAddress}/vcelin/api/cancelArticle`, {
                    method: 'DELETE',
                    mode: "cors",
                    cache: "default",
                    headers: {
                        "Content-Type": "application/json",
                        "token": this.state.token,
                    },
                body: JSON.stringify({
                    ImageFilenames: imagesToDelete
                })
                }
            );

            this.setState({
                title: this.state.data.title,
                text: this.state.data.text,
                isEditing: false,
                images: this.state.images.filter(o => imagesToDelete.indexOf(o.filename) === -1),
                imagesToDelete: [],
                newImages: []
            });
        } else {
            this.setState({
                title: this.state.data.title,
                text: this.state.data.text,
                isEditing: false,
                imagesToDelete: [],
                newImages: []
            });
        }


    }

    handleNewImage(image) {

        this.setState({
            newImages: [...this.state.newImages, {filename: image.filename, name: image.name}],
            images: [...this.state.images, image]
        });
    }

    render() {
        let userId = parseInt(localStorage.getItem("userId"));
        let data = this.state.data;
        if (data) {
            return (
                <div className="generalPadding">
                    <div>
                        <div className="articleDetails">

                            {this.state.isEditing && (userId === data.User.ID || userId === 1) ? (
                                    <form className="articleForm">
                                        <div className="input-group">
                                            <textarea value={this.state.title} onChange={this.handleTitleChange}
                                                      className="form-control articleDetailsTextarea" type="text"
                                                      placeholder="Title"
                                                      rows="3" cols="100"/>
                                        </div>
                                        <div className="input-group">
                                            <textarea value={this.state.text} onChange={this.handleTextChange}
                                                      className="form-control" type="text" placeholder="Text"
                                                      rows="6" cols="100"/>
                                        </div>
                                    </form>) :
                                (<div><h3>{data.title}</h3><p>{data.text}</p></div>)}

                            <span className="spanInfo">
                                {formatTimeSince(data.CreatedAt)} ago
                            </span>

                            <span className="spanInfo">
                                Sent by :
                                {data.User.name}
                            </span>
                            {!this.state.isEditing && userId ?

                                <button className="btn btn-default" onClick={this.handleEditClick}>Edit </button>
                                : null
                            }
                            {this.state.isEditing && userId ? <ImageInput
                                currentImageArraySize={this.state.images.length + this.state.imagesToDelete.length}
                                handleNewImage={this.handleNewImage} enableButtons={this.enableButtons}
                                enabled={this.state.buttonsEnabled}/> : null}
                        </div>
                        < ImageGallery showDelete={this.state.isEditing} handleImageDelete={this.handleImageDelete}
                                       images={this.state.images} selectedImages={this.state.imagesToDelete}
                                       isImageSelectable={true}/>
                    </div>

                    <div className="articleDetails">
                        {this.state.isEditing && userId ?
                            <button onClick={this.handleEditClick} className="btn btn-primary buttonMargin">
                                Update</button> : null}
                        {this.state.isEditing && (userId === data.User.ID || userId === 1) ?
                            <button onClick={this.handleArticleDelete} className="btn btn-primary buttonMargin">
                                Delete </button> : null}
                        {this.state.isEditing ?
                            <button onClick={this.handleUpdateCancel} className="btn btn-default buttonMargin">
                                Cancel</button> : null}
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