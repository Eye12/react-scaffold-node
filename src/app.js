import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import {withRouter} from "react-router";
import "./app.scss";
import NotFound from "./components/common/404";
import routes from "./router";

const {Component} = React;

class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    {
                        routes && routes.map(({path, component, exact}, index) => {
                            return <Route key={index} path={path} component={withRouter(component)} exact={exact}/>
                        })
                    }
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
