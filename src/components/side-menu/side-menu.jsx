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
    return publicRoutes.map(filteredRoute => ({
      key: filteredRoute.path,
      icon: filteredRoute.pageIcon,
      label: filteredRoute.label
    }));
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
