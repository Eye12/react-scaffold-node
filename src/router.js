/**
 * @Author: wyy
 * @Date: 2019/12/11
 * @Description: 路由配置，按需加载
 **/
import Loadable from 'react-loadable';
import Loading from "./components/common/Loading";

const Home   = Loadable({
          loader: () => import("./components/Home"),
          loading: Loading,
      }),
      About  = Loadable({
          loader: () => import("./components/About"),
          loading: Loading,
      }),
      routes = [
          {
              path: "/",
              component: Home,
              exact: true
          }, {
              path: "/about",
              component: About,
              exact: true
          }
      ];
export default routes;
