/**
 * @Author: wyy
 * @Date: 2019/12/9
 * @Description: Home
 **/

import * as React from "react";
import Header from "../common/Header";
import Body from "../common/Body";
import Footer from "../common/Footer";
const {Component} = React;

class About extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <Header title="This is about page" someWhere="/"/>
                <Body/>
                <Footer/>
            </>
        )
    }
}

export default About;
