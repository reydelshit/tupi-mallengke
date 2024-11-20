import { Link, Outlet, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  const path = useLocation().pathname;
  return (
    <div className="bg-[#FFF5ED] bg-center w-full min-h-screen h-full flex items-center flex-col ">
      <div className="w-full text-center h-full">
        <div className="flex gap-4 w-full border-2 h-full">
          <div className="w-[15rem] bg-[#272626] text-[#fff6f2] h-screen fixed inset-0 flex flex-col text-start p-8">
            <h1 className="font-bold italic text-2xl">TUPI MALLENGKE </h1>
            <div className="flex flex-col mt-[2rem] text-xl">
              <Link to="/">Dashboard</Link>

              <Link to="/payment">Payment</Link>

              <Link to="/sms">SMS</Link>
            </div>
          </div>

          <div className="ml-[18rem] h-screen">
            {path === '/' ? <Dashboard /> : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
