import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { checkFirebaseRole } from '../../../../shared/utils/checkFirebaseRole'

export const Route = createFileRoute('/_authenticated/_admin')({
    beforeLoad: async ({ context, location }) => {
        const user  = context.user
        const firebaseRole = await checkFirebaseRole()
        if (!context.user && location.pathname === '/admin') {
            throw redirect({
              to: '/',
            })
        }
        if (user && firebaseRole !== "admin") {
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
