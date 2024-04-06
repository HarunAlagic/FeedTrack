import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './views/AdminPanel/AdminPanelLoginView.jsx';
import AdminDashboardPage from './views/AdminPanel/AdminDashboard.tsx';
import Users from './views/AdminPanel/Users.tsx';
import Tellers from './views/AdminPanel/Tellers.tsx';
import Branches from './views/AdminPanel/Branches.tsx';
import Layout from './Layout.tsx';
import Feedbacks from './views/AdminPanel/Feedbacks.tsx';

function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      element:<Login/> 
    },
    {
      path: "/",
      element: <Layout />, 
      children: [
        {
          path:"/home",
          element:<AdminDashboardPage/>
        },
        {
          path:"/users",
          element:<Users/>
        },
        {
          path:"/tellers",
          element:<Tellers/>
        },
        {
          path:"/branches",
          element:<Branches/>
        },
        {
          path:"/feedbacks",
          element:<Feedbacks/>
        }
      ]
    }
  ]);
  
  return <RouterProvider router={router} />;
}
export default App;
