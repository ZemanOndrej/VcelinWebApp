/**
 * Created by zeman on 04-May-17.
 */

// import { createBrowserHistory } from 'history';
import  ReactDOM from "react-dom";
import  React from "react";
import {
    Route,
    Link,
    BrowserRouter as Router
} from 'react-router-dom';
import PostList from "./components/Posts";
import Home from "./components/Home";
import Header from "./components/Header";
import Comments from "./components/Comments";

class App extends React.Component{
    render(){
        return(
            <Router>
                <div>
                    <Header/>

                    <Route path={"/posts"} component={PostList} />
                    <Route exact path="/" component={Home}/>
                    <Route path={"/post/:postId"} component={Comments}/>
                </div>

            </Router>
        )
    }
}


ReactDOM.render(<App/>,document.querySelector("#app"));

