import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { publicRoutes } from '../../routes';
import './side-menu.scss';
import { useMemo } from 'react';
import mainLogo from '../../assets/images/dthl_logo.png';

const SideMenu = () => {
  const location = useLocation();
  const { pathname } = location;
  const navigation = useNavigate();

  const getDefaultMenuItems = useMemo(() => {
    let ROUTES_NEED_TO_SHOW = ['/', '/reports', '/employee', '/department', '/benefit', '/contract'];
    return publicRoutes
      .filter(route => ROUTES_NEED_TO_SHOW.includes(route.path))
      .map(filteredRoute => ({ key: filteredRoute.path, icon: filteredRoute.pageIcon, label: filteredRoute.label }));
  }, []);
 
  const handleNavigateToAnotherPage = e => {
    const redirectURL = `${e.key}`;

    navigation(redirectURL);
  };

  const defaultActiveMenu = useMemo(() => {
    return pathname ? pathname : '/';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="side__menu-container">
      <img src={mainLogo} alt="TLU LOGO" className="side__menu-logo" />
      <Menu
        defaultSelectedKeys={[defaultActiveMenu]}
        mode="inline"
        theme="dark"
        items={getDefaultMenuItems}
        onClick={handleNavigateToAnotherPage}
      />
    </div>
  );
};
export default SideMenu;
