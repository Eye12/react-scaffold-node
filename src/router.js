import Home from "./components/Home";
import About from "./components/About";
// import Loadable from 'react-loadable';
// import Loading from "./components/common/Loading";
// const Home = Loadable({
//     loader: () => import("./components/Home"),
//     loading: Loading,
// });
// const About = Loadable({
//     loader: () => import("./components/About"),
//     loading: Loading,
// });
const routes = [
    {
        path: "/",
        component: Home,
        exact: true
    },{
        path: "/about",
        component: About,
        exact: true
    }
];
export default routes;
