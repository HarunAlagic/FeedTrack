import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './views/AdminPanel/AdminPanelLoginView.jsx';
import AdminHomePage from './views/AdminPanel/AdminPanelHomePageView.jsx';
import BranchPage from './views/AdminPanel/AdminPanelBranchesView.tsx';
import TellerPage from './views/AdminPanel/AdminPanelTellersView.tsx';

function App() {
  return (
    <BrowserRouter>
     <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/homePage' element={<AdminHomePage />}/>
      <Route path='/branches' element={<BranchPage />}/>
      <Route path='/tellers' element={<TellerPage />}/>
     </Routes>
    </BrowserRouter>
  );
}
export default App;
