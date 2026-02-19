import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_authenticated')({
  beforeLoad: ({ context, location }) => {    
    if (!context.auth.user) {
      throw redirect({
        to: '/login'
      })
    } 
    if (context.auth.user && location.pathname === '/') {
      throw redirect({
        to: '/home',
      })
    }
  },
  component: () => <Outlet />,
})