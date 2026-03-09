import * as React from 'react';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import type { UserData } from '../../domains/auth/types';

interface RouterContext {
  user: UserData | null;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <TanStackRouterDevtools />
    </React.Fragment>
  );
}
