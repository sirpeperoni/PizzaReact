import { createFileRoute } from '@tanstack/react-router'
import { Login } from '../../../pages/login/Login'

export const Route = createFileRoute('/_notauthenticated/login')({
  component: Login,
})

function RouteComponent() {
  return <div>Hello "/auth/login"!</div>
}
