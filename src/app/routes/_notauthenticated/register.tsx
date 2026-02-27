import { createFileRoute } from '@tanstack/react-router'
import { RegisterPage } from '../../../pages/register/Register'

export const Route = createFileRoute('/_notauthenticated/register')({
  component: RegisterPage,
})

function RouteComponent() {
  return <div>Hello "/_notauthenticated/register"!</div>
}
