/**
 * Created by Ondrej on 11/06/2017.
 */
import * as React from "react";
import {serverAddress} from "../../serverConfig";
import ImageGallery from "./ImageGallery";

export default class ArticleForm extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.data) {

            this.state = {
                error: null,
                text: this.props.data.article.text,
                title: this.props.data.article.title
            };
        } else {

            this.state = {
                error: null,
                text: "",
                title: "",
                imgNames: [],
                newArticle: true,
                buttonsEnabled: true,
                images: []
            };

        }
        this.handleArticleCreate = this.handleArticleCreate.bind(this);
        this.handleArticleTitleChange = this.handleArticleTitleChange.bind(this);
        this.handleArticleTextChange = this.handleArticleTextChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleArticleCancel = this.handleArticleCancel.bind(this);
    }

    handleArticleCreate() {
        fetch(`${serverAddress}/vcelin/api/articles`, {
            method: 'POST',
            mode: "cors",
            cache: "default",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token"),
            },
            body: JSON.stringify({

                Title: this.state.title,
                Text: this.state.text,
                ImageFileNames: this.state.imgNames,
                ImageNames: this.state.imgNames
            })
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then(json => {
                        this.props.newArticleHandler(json.article);
                        this.props.closeModal();
                    });
                }
            })
    }

    handleArticleTextChange(event) {
        this.setState({text: event.target.value});
    }

    handleArticleTitleChange(event) {
        this.setState({title: event.target.value})
    }

    handleArticleCancel(event) {
        fetch(`${serverAddress}/vcelin/api/cancelArticle`, {
                method: 'DELETE',
                mode: "cors",
                cache: "default",
                headers: {
                    "Content-Type": "application/json",
                    "token": localStorage.getItem("token"),
                },
                body: JSON.stringify({ImageFileNames: this.state.imgNames,})
            }
        );
        this.props.closeModal(event);
    }

    handleInputChange(event) {

        let target = event.target || window.event.srcElement;
        let files = target.files;

        if (FileReader && files && files.length) {
            this.setState({buttonsEnabled: false});
            for (let i = 0; i < files.length; i++) {

                let fr = new FileReader();
                fr.onload = () => {
                    this.setState({images: [...this.state.images, fr.result]});
                    fetch(`${serverAddress}/vcelin/api/uploadImage`, {
                        method: 'POST',
                        mode: "cors",
                        cache: "default",
                        headers: {
                            "Content-Type": "image/png",
                            "token": localStorage.getItem("token"),
                            "fileName": files[i].name
                        },
                        body: fr.result
                    })
                        .then((response) => {
                            if (response.ok) {
                                return response.json().then(json => {
                                    this.setState({imgNames: [...this.state.imgNames, json.filename]});

                                    if (i === files.length - 1) {
                                        this.setState({buttonsEnabled: true})
                                    }
                                });
                            }
                        });
                };
                fr.readAsDataURL(files[i]);

            }
        }
    }


    render() {
        return (
            <div>
                <div className="overlay"></div>
                <div className="formWindow">

                    <form>
                        <div className="input-group">
                            <textarea value={this.state.title} onChange={this.handleArticleTitleChange}
                                      className="form-control" type="text" placeholder="Title" rows="1"/>
                        </div>
                        <div className="input-group">
                            <textarea value={this.state.text} onChange={this.handleArticleTextChange}
                                      className="form-control" type="text" placeholder="Text" rows="3"/>
                        </div>
                        {!this.state.newArticle ? (
                            <button disabled={!this.state.buttonsEnabled} onClick={this.handleUpdate}
                                    className="btn btn-primary">Update</button>
                        ) : null}

                        <div className="imageUpload">

                            <ImageGallery images={this.state.images}/>

                            <input disabled={!this.state.buttonsEnabled}
                                   id="inputFiles" type='file' name="img" multiple
                                   style={{color: "transparent"}}
                                   onChange={this.handleInputChange}/>

                        </div>

                    </form>

                    <button disabled={!this.state.buttonsEnabled} onClick={this.handleArticleCreate}>Create</button>
                    <button disabled={!this.state.buttonsEnabled} onClick={this.handleArticleCancel}>Cancel</button>

                </div>

            </div>
        )
    }
}
