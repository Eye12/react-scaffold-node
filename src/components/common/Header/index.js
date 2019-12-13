/**
 * @Author: wyy
 * @Date: 2019/12/9
 * @Description: Header
 **/
import * as React from "react";
import "./index.scss";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import appAction from "../../../action/index";

const {Component} = React;


class Header extends Component {
    constructor(props) {
        super(props)
    }

    clickHandler = () => {
        let {someWhere, history} = this.props;
        this.props.countAction();
        history.push({
            pathname: someWhere,
            state: {
                name: "lle"
            }
        });
    };

    render() {
        return (
            <div className="header" onClick={this.clickHandler}>
                {this.props.title}
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ( {
    countAction: () => dispatch(appAction)
} );

export default connect(undefined, mapDispatchToProps)(withRouter(Header));
