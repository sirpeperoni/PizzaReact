import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { UserInfo } from '../store/authSlice';

export interface RouterContext {
  auth: {
    user: UserInfo | null;
    isLoading: boolean;
    error: string | null | undefined;
  };
}


export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet/>,
})

