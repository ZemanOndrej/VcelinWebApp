/**
 * Created by zeman on 07-May-17.
 */
import React from "react";
import {serverAddress} from "../../serverConfig";


export default class ImageInput extends React.Component {

    constructor(props) {
        super(props);

        this.handleImageInputChange = this.handleImageInputChange.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
    }

    handleImageInputChange(event) {
        let target = event.target || window.event.srcElement;
        let files = target.files;
        if (FileReader && files && files.length) {
            this.setState({buttonsEnabled: false});
            Array.from(files).forEach((file, i) => {
                let fr = new FileReader();
                fr.onload = () => {
                    this.uploadImage(files, file, i, fr);
                };
                fr.readAsDataURL(file);
            });
        }
    }

    uploadImage(files, file, index, fileReader) {
        let data = new FormData();
        data.append("image", file);
        fetch(`${serverAddress}/vcelin/api/uploadImage`, {
            method: 'POST',
            mode: "cors",
            cache: "default",
            headers: {
                "token": localStorage.getItem("token"),
            },
            body: data
        })
            .then((response) => {
                if (response.ok) {
                    return response.json().then(json => {
                        this.props.handleNewImage({
                            filename: json.filename,
                            name: json.filename.split(".")[0],
                            data: fileReader.result
                        });
                        if (index === files.length - 1) {
                            let file = document.getElementById("imageInputButton");
                            file.value = file.defaultValue;
                            this.props.enableButtons(true);
                        }
                    });
                }
            });
    }

    render() {

        return (

            <input disabled={!this.props.enabled}
                   className="imageInputButton" id="imageInputButton"
                   type='file' name="img" multiple size="60"
                   onChange={this.handleImageInputChange}/>

        )
    }
}