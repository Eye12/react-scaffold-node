/**
 * @Author: wyy
 * @Date: 2019/12/9
 * @Description: Home
 **/

import * as React from "react";

const {Component} = React;
import Index from "../common/Header";
import Body from "../common/Body";
import Footer from "../common/Footer";

class Home extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <Index title="Welcome Magical Child's World" to="/about"/>
                <Body/>
                <Footer/>
            </>
        )
    }
}

export default Home;