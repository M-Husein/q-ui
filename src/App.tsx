import { useEffect, useState } from 'react';
import { AppLayout } from './layout/AppLayout';
import { demoRoutes, findRoute } from './pages/routes';

const readHash = () => window.location.hash.replace(/^#\/?/, '');

export const App = () => {
  const [activeId, setActiveId] = useState<string>(() => readHash() || demoRoutes[0].id);

  useEffect(() => {
    const onHash = () => setActiveId(readHash() || demoRoutes[0].id);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const route = findRoute(activeId) ?? demoRoutes[0];
  const Page = route.component;

  return (
    <AppLayout routes={demoRoutes} activeId={route.id}>
      <Page />
    </AppLayout>
  );
};
