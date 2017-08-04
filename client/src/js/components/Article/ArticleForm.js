/**
 * Created by Ondrej on 11/06/2017.
 */
import * as React from "react";
import {serverAddress} from "../../serverConfig";
import ImageGallery from "./ImageGallery";
import ImageInput from "./ImageInput";

export default class ArticleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            text: "",
            title: "",
            buttonsEnabled: true,
            images: [],
            imagesToDelete: [],
            token: localStorage.getItem("token")
        };

        this.handleCreate = this.handleCreate.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleNewImage = this.handleNewImage.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleImageDelete = this.handleImageDelete.bind(this);
        this.handleEnableButtons = this.handleEnableButtons.bind(this);

        window.onbeforeunload = this.handleCancel
    }

    componentDidMount() {
        if (!this.state.token) {
            this.props.history.push({
                pathname: "/vcelin/articles",
                state: {
                    error: " You moust be logged in to create article "
                }
            })
        }

    }

    handleImageDelete(index) {
        this.setState({
            imagesToDelete: [...this.state.imagesToDelete, this.state.images.find(o => o.filename === index)],
            images: this.state.images.filter(o => o.filename !== index)
        });
    }

    handleCreate() {
        fetch(`${serverAddress}/vcelin/api/articles`, {
            method: 'POST',
            mode: "cors",
            cache: "default",
            headers: {
                "Content-Type": "application/json",
                "token": this.state.token,
            },
            body: JSON.stringify({

                Title: this.state.title,
                Text: this.state.text,
                NewImages: this.state.newImages,
                DeleteImages: this.state.imagesToDelete
            })
        })
            .then((response) => {
                if (response.ok) {
                    this.props.history.push("/vcelin/articles")
                }
            });
        this.setState({imagesToDelete: [], images: []});

    }

    handleTextChange(event) {
        this.setState({text: event.target.value});
    }

    handleTitleChange(event) {
        this.setState({title: event.target.value})
    }

    handleCancel() {
        fetch(`${serverAddress}/vcelin/api/cancelArticle`, {
                method: 'DELETE',
                mode: "cors",
                cache: "default",
                headers: {
                    "Content-Type": "application/json",
                    "token": this.state.token,
                },
            body: JSON.stringify({ImageFilenames: this.state.images.concat(this.state.imagesToDelete).map(o => o.filename)})
            }
        ).then((response) => {
            if (response.ok) {
                this.setState({
                    error: null,
                    text: "",
                    title: "",
                    buttonsEnabled: true,
                    images: [],
                    imagesToDelete: []
                });
                this.props.history.push("/vcelin/articles")
            }
        });
    }

    handleNewImage(image) {
        this.setState({images: [...this.state.images, image]});
    }

    handleEnableButtons(value) {
        this.setState({enableButtons: value});

    }

    render() {

        return (
            <div className="generalPadding">
                <div>
                    <div className="articleDetails">

                        <form className="articleForm">
                            <div className="input-group">
                                    <textarea value={this.state.title} onChange={this.handleTitleChange}
                                              className="form-control" type="text" placeholder="Title"
                                              rows="3" cols="100"/>
                            </div>
                            <div className="input-group">
                                    <textarea value={this.state.text} onChange={this.handleTextChange}
                                              className="form-control" type="text" placeholder="Text"
                                              rows="6" cols="100"/>
                            </div>
                        </form>
                        <ImageInput
                            currentImageArraySize={this.state.images.length}
                            handleNewImage={this.handleNewImage} enableButtons={this.handleEnableButtons}
                            enabled={this.state.buttonsEnabled}/>

                    </div>
                    < ImageGallery showDelete={true} handleImageDelete={this.handleImageDelete}
                                   images={this.state.images} selectedImages={this.state.imagesToDelete}/>
                    <div className="articleDetails">
                        <button disabled={!this.state.buttonsEnabled} onClick={this.handleCancel}
                                className="btn btn-default buttonMargin">Cancel
                        </button>
                        <button disabled={!this.state.buttonsEnabled} className="btn btn-default"
                                onClick={this.handleCreate}>Create
                        </button>
                    </div>
                </div>


            </div>
        )


    }
}
