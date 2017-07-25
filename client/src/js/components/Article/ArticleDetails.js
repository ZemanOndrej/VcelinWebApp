/**
 * Created by Ondrej on 14/07/2017.
 */
import React from "react";
import {serverAddress} from "../../serverConfig";
import ImageGallery from "./ImageGallery";
import {formatTimeSince} from "../../util";

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
        this.handleAddNewImages = this.handleAddNewImages.bind(this);
        this.handleUpdateCancel = this.handleUpdateCancel.bind(this);
    }

    componentDidMount() {

        fetch(`${serverAddress}/vcelin/api/articles/${this.props.match.params.articleId}`, {
            method: "GET"
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                        .then((json) => {

                            this.setState({data: json.data, title: json.data.title, text: json.text});

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


        //need to fix
        fetch(`${serverAddress}/vcelin/api/articles/${this.state.data.ID}`, {
            method: "DELETE",
            mode: "cors",
            cache: "default",
            headers: {"Content-type": "application/json", "token": localStorage.getItem("token")}
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then((json) => {
                        this.props.history.push("/vcelin/articles")

                    });
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
            return obj.fileName === index;
        });
        let deleteImgIndex = this.state.imagesToDelete.findIndex((obj) => {
            return obj.fileName === index;
        });

        if (deleteImgIndex === -1 && newImgIndex > -1) {
            this.setState({
                newImages: this.state.newImages.filter((obj) => {
                    return obj.fileName !== index
                }),
                imagesToDelete: [...this.state.imagesToDelete, {fileName: index}],
            });
        } else if (deleteImgIndex === -1 && newImgIndex === -1) {
            this.setState({
                imagesToDelete: [...this.state.imagesToDelete, {fileName: index, isOldImage: true}],
            });

        } else if (deleteImgIndex > -1 && this.state.imagesToDelete[deleteImgIndex].isOldImage) {

            this.setState({
                imagesToDelete: this.state.imagesToDelete.filter((obj) => {
                    return obj.fileName !== index
                })
            });

        } else if (deleteImgIndex > -1) {
            this.setState({
                newImages: [...this.state.newImages, {fileName: index}],
                imagesToDelete: this.state.imagesToDelete.filter((obj) => {
                    return obj.fileName !== index
                })
            });

        }
    }

    handleEditClick() {

        if (this.state.isEditing) {

            fetch(`${serverAddress}/vcelin/api/articles/${this.state.data.ID}`, {
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
                        return o.fileName
                    })
                })
            }).then((response) => {
                    if (response.ok) {
                        return response.json().then((json) => {

                                let imagesNamesArray = this.state.imagesToDelete.map(o => o.fileName);

                                let article = this.state.data;
                                article.title = this.state.title;
                                article.text = this.state.text;
                                this.setState({
                                    data: article,
                                    images: this.state.images.filter(o => imagesNamesArray.indexOf(o.FileName) === -1),
                                    imagesToDelete: [],
                                    newImages: []
                                });
                            }
                        );
                    }
                }
            )
            ;
            this
                .setState({isEditing: false})
        }
        else {
            this.setState({isEditing: true, text: this.state.data.text})

        }
    }

    handleAddNewImages(event) {

        let target = event.target || window.event.srcElement;
        let files = target.files;

        if (FileReader && files && files.length) {
            this.setState({buttonsEnabled: false});
            for (let i = 0; i < files.length; i++) {

                let fr = new FileReader();
                fr.onload = () => {

                    let arr = this.state.images;
                    let index = arr.push({data: fr.result}) - 1;

                    //need to rewrite this (upload)
                    this.setState({images: arr});
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
                                    let arr = this.state.images;
                                    arr[index].FileName = json.filename;
                                    this.setState({
                                        newImages: [...this.state.newImages, {fileName: json.filename}],
                                        images: arr
                                    });
                                    if (i === files.length - 1) {
                                        let file = document.getElementById("inputFiles");
                                        file.value = file.defaultValue;
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

    handleUpdateCancel() {

        if (this.state.newImages.length > 0) {
            fetch(`${serverAddress}/vcelin/api/cancelArticle`, {
                    method: 'DELETE',
                    mode: "cors",
                    cache: "default",
                    headers: {
                        "Content-Type": "application/json",
                        "token": this.state.token,
                    },
                    body: JSON.stringify({ImageFileNames: this.state.newImages.map(o => o.fileName)})
                }
            );

            let arr = this.state.images;

            let imagesNamesArray = this.state.newImages.map(o => o.fileName);


            this.setState({
                title: this.state.data.title,
                text: this.state.data.text,
                isEditing: false,
                images: this.state.images.filter(o => imagesNamesArray.indexOf(o.FileName) === -1),
                imagesToDelete: [],
                newImages:
                    []
            })
            ;
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
                                                      className="form-control" type="text" placeholder="Title"
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
                            {this.state.isEditing && userId ? <input disabled={!this.state.buttonsEnabled}
                                                                     id="inputFiles" type='file' name="img" multiple
                                                                     style={{
                                                                         color: "transparent",
                                                                         display: "inline-block"
                                                                     }}
                                                                     onChange={this.handleAddNewImages}/> : null}
                        </div>
                        < ImageGallery showDelete={this.state.isEditing} handleImageDelete={this.handleImageDelete}
                                       images={this.state.images} selectedImages={this.state.imagesToDelete}/>
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