/**
 * Created by Ondrej on 11/06/2017.
 */
import * as React from "react";
import {serverAddress} from "../../serverConfig";
export default class ArticleForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleArticleCreate = this.handleArticleCreate.bind(this);

        if (this.props.data) {

            this.state = {error: null, text: this.props.data.article.text, title: this.props.data.article.title};
        } else {

            this.state = {error: null, text: "", title: "", imgNames: [], newArticle: true, buttonsEnabled: true};

        }
        this.handleArticleTitleChange = this.handleArticleTitleChange.bind(this);
        this.handleArticleTextChange = this.handleArticleTextChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleArticleCreate() {
        console.log(`${this.state.text}  ${this.state.title} ${this.state.imgNames}   LUL`);
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
                        console.log(json);
                        this.props.newArticleHandler(json.article);
                        this.props.closeModal();


                    });
                }
            })
    }

    handleInputChange(event) {

        let preview = document.getElementById("imagePreviews");
        let target = event.target || window.event.srcElement;
        let files = target.files;

        if (FileReader && files && files.length) {
            this.setState({buttonsEnabled: false});
            for (let i = 0; i < files.length; i++) {

                let fr = new FileReader();
                fr.onload = (file) => {
                    let imgDiv = document.createElement("img");
                    imgDiv.style.height = "100px";
                    imgDiv.style.width = "100px";
                    imgDiv.src = fr.result;
                    preview.appendChild(imgDiv);
                    /*
                     Will change this part a little bit
                     Ill use Promise.all to wait for images
                     */
                    let formData = new FormData();
                    formData.append("image", file.target.result);
                    fetch(`${serverAddress}/vcelin/api/uploadimage`, {
                        method: 'POST',
                        mode: "cors",
                        cache: "default",
                        headers: {
                            "Content-Type": "image/png",
                            "token": localStorage.getItem("token"),
                            "fileName": files[i].name
                        },
                        body: file.target.result
                    })
                        .then((response) => {
                            if (response.ok) {
                                return response.json().then(json => {
                                    let imgNames = this.state.imgNames;
                                    imgNames.push(json.filename);
                                    this.setState({imgNames: imgNames});
                                    console.log(imgNames);
                                    if (i === files.length - 1) {
                                        this.setState({buttonsEnabled: true})
                                    }
                                });
                            }
                        })
                };
                fr.readAsDataURL(files[i]);
            }
        }
    }

    handleArticleTextChange(event) {
        this.setState({text: event.target.value});
    }

    handleArticleTitleChange(event) {
        this.setState({title: event.target.value})
    }

    render() {
        return (
            <div >
                <div style={{
                    zIndex: "1000",
                    position: "fixed",
                    top: "0",
                    left: "0",
                    height: "100%",
                    width: "100%",
                    backgroundColor: "white",
                    opacity: "0.75"
                }}>
                </div>

                <div style={{
                    border: "black solid 1px",
                    zIndex: "1000", position: "fixed", top: "30%", left: "30%", margin: "0 auto",
                    height: "40%", width: "40%",
                    backgroundColor: "#d6d6d6", opacity: "1"
                }}>

                    <form >
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

                            <div id="imagePreviews">

                            </div>

                            <input disabled={!this.state.buttonsEnabled} id="inputFiles" type='file' name="img" multiple
                                   onChange={this.handleInputChange}/>

                        </div>

                        {/*FOTO PLACE*/}
                    </form>

                    {/*<button onClick={this.handleDelete}> Delete</button>*/}
                    <button disabled={!this.state.buttonsEnabled} onClick={this.handleArticleCreate}>Create</button>
                    <button disabled={!this.state.buttonsEnabled} onClick={this.props.closeModal}>Cancel</button>

                </div>
            </div>
        )
    }
}
