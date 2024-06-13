import config from '../config';
import Home from '../pages/home/home';
import Camera from '../pages/camera/camera';
import StorageComponent from '../pages/storage/storage'

import { AppstoreOutlined, VideoCameraOutlined, NotificationOutlined } from '@ant-design/icons';
const publicRoutes = [
  {
    path: config.routes.home,
    element: <Home />,
    pageIcon: <AppstoreOutlined />,
    label: 'Trang chủ',
    needShowSideMenu: true
  },
  {
    path: config.routes.camera,
    element: <Camera />,
    pageIcon: <VideoCameraOutlined />,
    label: 'Quản lý',
    needShowSideMenu: true
  },
  {
    path: config.routes.storage,
    element: <StorageComponent />,
    pageIcon: <NotificationOutlined />,
    label: 'Lưu trữ',
    needShowSideMenu: true
  }
];

export { publicRoutes };
