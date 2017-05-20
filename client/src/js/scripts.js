/**
 * Created by zeman on 04-May-17.
 */
import ReactDOM from "react-dom";
import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import PostList from "./components/PostList";
import Home from "./components/Home";
import Header from "./components/Header";
import CommentList from "./components/CommentList";


const App = () => (
            <Router>
                <div>
                    <Header />
                    <Switch>
                        <Route path={"/vcelin/posts"} component={PostList} exact/>
                        <Route exact path="/vcelin" component={Home}/>
                        <Route path={"/vcelin/posts/:postId"} component={CommentList}/>
                    </Switch>
                </div>
            </Router>
);

ReactDOM.render(<App/>,document.querySelector("#app"));

