/**
 * @Author: wyy
 * @Date: 2019/12/9
 * @Description: Home
 **/

import * as React from "react";
import {connect} from "react-redux";

const {Component} = React;
import Header from "../common/Header";
import Body from "../common/Body";
import Footer from "../common/Footer";

class Home extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log("=========>>>", this.props.appState);
        return (
            <>
                <Header title="Welcome Magical Child's World" someWhere="/about"/>
                <Body/>
                <Footer/>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        appState: state
    }
};

export default connect(mapStateToProps)(Home);
