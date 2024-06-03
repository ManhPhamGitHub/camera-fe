import config from '../config';
import Home from '../pages/home/home';
import {
  AppstoreOutlined,
} from '@ant-design/icons';
const publicRoutes = [
  {
    path: config.routes.home,
    element: <Home />,
    pageIcon: <AppstoreOutlined />,
    label: 'Trang chủ',
    needShowSideMenu: true
  }
];

export { publicRoutes };
