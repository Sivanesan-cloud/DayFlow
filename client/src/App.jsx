import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  useEffect(() => {
    const openEmployeeSection = event => {
      const link = event.target.closest('a');
      const destinations = {
        '#profile': '/employee/profile',
        '#payroll': '/employee/salary',
        '#salary': '/employee/salary',
      };
      const destination = link && destinations[link.getAttribute('href')];
      if (!destination) return;
      event.preventDefault();
      window.location.assign(destination);
    };
    document.addEventListener('click', openEmployeeSection);
    return () => document.removeEventListener('click', openEmployeeSection);
  }, []);

  return <AppRoutes />;
}
