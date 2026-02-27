import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
    beforeLoad: ({ context, location }) => {
        const user  = context.user
     
        if (!user && location.pathname === '/home') {
          throw redirect({
            to: '/login',
          })
        }
      },
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet/>
}
