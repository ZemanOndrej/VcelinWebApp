import React from "react";
import ImageGallery from "./Article/ImageGallery";

export default class About extends React.Component {

    render() {
        let images = [{filename: "vcelinTim.jpg"}];

        return (
            <div>
                <div className="aboutPage"></div>
                <div className="aboutContainer">

                    <div className="aboutText">
                        <h1>About</h1>
                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy
                            text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                            make a type specimen book. It has

                        </p>
                        <ImageGallery showDelete={false} handleImageDelete={() => {
                        }}
                                      images={images} selectedImages={[]} static={true}
                                      isImageSelectable={false}/>
                        <div>
                            {/*<iframe className="aboutIframe"*/}
                            {/*src="https://goo.gl/gyXvJH" style={{border: 0}}*/}
                            {/*width="200" height="200" frameBorder="0" allowFullScreen>*/}
                            {/*</iframe>*/}
                        </div>
                    </div>

                </div>
            </div>


        )
    }
}