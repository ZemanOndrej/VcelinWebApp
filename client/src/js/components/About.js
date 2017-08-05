import React from "react";

export default class About extends React.Component {


    render() {
        return (
            <div>


                <div style={{height: "100vh", width: "100%", position: "relative"}}>

                    <div style={{
                        top: "50%",
                        margin: "auto",
                        textAlign: "center",
                        left: "50%",
                        border: "black solid 1px"
                    }}>
                        <h1>About</h1>
                        <div>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy
                            text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                            make a type specimen book. It has
                            survived not only five centuries, but also the leap into electronic typesetting, remaining
                            essentially unchanged. It was popularised
                            in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
                            recently with desktop publishing software
                            like Aldus PageMaker including versions of Lorem Ipsum.
                        </div>
                    </div>

                    <div>
                        {/*<iframe*/}
                        {/*src="https://goo.gl/gyXvJH" style={{border:0}}*/}
                        {/*width="600" height="450" frameBorder="0" allowFullScreen>*/}
                        {/*</iframe>*/}
                    </div>
                </div>

            </div>

        )
    }
}