import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <div className='w-full flex flex-col sm:flex-row justify-between px-6 gap-6'>
      <main className='w-full'>
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
};

export default App;
