import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Header } from '../../../shared/components/Header/Header';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    const user = context.user;

    if (!user && (location.pathname === '/home' || location.pathname === '/profile')) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
