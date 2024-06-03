import './index.scss';
import SideMenu from '../components/side-menu/side-menu';

const PageLayout = ({ children }) => {
  return (
    <div className="default__layout-container">
      <div className="menu__side">
        <SideMenu />
      </div>
      <div className="page__content">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
