import * as React from "react";
import * as ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import {
    Switch,
    Route,
} from "react-router-dom";
import { Router } from "react-router";
import "./app.scss";
import NotFound from "./components/common/404";
import { createBrowserHistory } from "history";
import routes from "./router";
import appReducers from "./reducers/index";


const {Component} = React;
const history = createBrowserHistory();
const store = createStore(appReducers);

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Switch>
                        {
                            routes && routes.map(({path, component, exact}, index) => {
                                return <Route key={index} path={path} component={component} exact={exact}/>
                            })
                        }
                        <Route component={NotFound}/>
                    </Switch>
                </Router>
            </Provider>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
