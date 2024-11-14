import App from '@/App';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminRoot = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // const isLoginTupiMapping = localStorage.getItem('isLoginTupiMapping');
  const isLoginTupiMapping = true;

  useEffect(() => {
    if (!isLoginTupiMapping) {
      navigate('/login');
    }
  }, [isLoginTupiMapping, navigate]);

  return <App />;
};

export default AdminRoot;
