import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '../../domains/auth/components/register-form/RegisterForm'
import { RegisterPage } from '../../pages/register/Register'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RouteComponent() {
  return <div>Hello "/register"!</div>
}
