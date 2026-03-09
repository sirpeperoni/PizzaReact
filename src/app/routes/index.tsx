import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context, location }) => {
    const user = context.user;

    if (user && location.pathname === '/') {
      throw redirect({
        to: '/home',
      });
    }
    if (!user && location.pathname === '/') {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/"!</div>;
}
