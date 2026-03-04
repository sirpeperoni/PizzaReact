import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_notauthenticated')({
    beforeLoad: ({ context, location }) => {
      const user  = context.user
    
      if (user) {
        throw redirect({
          to: '/home',
        })
      }
    },
    component: RouteComponent,
})

function RouteComponent() {
    return <Outlet/>
}
