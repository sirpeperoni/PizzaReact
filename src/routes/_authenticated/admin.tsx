import { createFileRoute, redirect } from '@tanstack/react-router'
import { checkFirebaseRole } from '../../utils/checkAdminRole';

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: async ({ context, location }) => {
    const role = await checkFirebaseRole()
    if (!context.auth.user && location.pathname === '/admin') {
      throw redirect({
        to: '/',
      })
    }
    if (context.auth.user && role !== "admin") {
      throw redirect({
        to: '/home',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/admin"!</div>
}
