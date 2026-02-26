import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AssetEntryPage } from './pages/AssetEntryPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AddToHomeScreenPrompt } from './components/AddToHomeScreenPrompt';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'oklch(0.22 0.014 250)',
            border: '1px solid oklch(0.32 0.02 250)',
            color: 'oklch(0.95 0.01 250)',
          },
        }}
      />
      <AddToHomeScreenPrompt />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const entryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/entry',
  component: AssetEntryPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([indexRoute, entryRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
