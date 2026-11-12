import { Refine } from '@refinedev/core';
import routerBindings, { DocumentTitleHandler, UnsavedChangesNotifier } from '@refinedev/react-router';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router';
import { qAuthProvider } from './lib/authProvider';
import { AppLayout } from './layout/AppLayout';
import { DEFAULT_PATH, demoRoutes } from './pages/routes';
import { NotFound } from './pages/NotFound';

/**
 * Refine must render inside the router context, so it lives in a layout route
 * (not the root). DocumentTitleHandler and UnsavedChangesNotifier use
 * react-router hooks and must also sit below RouterProvider.
 */
const RefineLayout = () => (
  <Refine
    authProvider={qAuthProvider}
    routerProvider={routerBindings}
    resources={demoRoutes.map((r) => ({ name: r.path.slice(1), meta: { label: r.label } }))}
    options={{
      disableTelemetry: true,
      syncWithLocation: true,
      warnWhenUnsavedChanges: false,
    }}
  >
    <Outlet />
    <DocumentTitleHandler handler={({ resource }) => `${resource?.meta?.label ?? 'Q UI'} · Q UI`} />
    <UnsavedChangesNotifier />
  </Refine>
);

const router = createBrowserRouter([
  {
    Component: RefineLayout,
    children: [
      {
        Component: AppLayout,
        children: [
          { index: true, element: <Navigate to={DEFAULT_PATH} replace /> },
          ...demoRoutes.map((r) => ({ path: r.path, Component: r.component })),
          { path: '*', Component: NotFound },
        ],
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
