import { publicRoutes } from './routes';
import PageLayout from './layout';
import { Routes, Route } from 'react-router-dom';
import { Fragment } from 'react';
function App() {
  return (
    <Routes>
      {publicRoutes.map((route, index) => {
        const Layout = route.needShowSideMenu ? PageLayout : Fragment;
        return <Route path={route.path} key={index} element={<Layout>{route.element}</Layout>} />;
      })}
    </Routes>
  );
}

export default App;
