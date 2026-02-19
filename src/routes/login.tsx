import { createFileRoute, redirect } from '@tanstack/react-router'
import { Login } from '../pages/Login/login'

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context, search }) => {
    if (context.auth.user) {
      throw redirect({ to: '/' })
    }
  },
  component: Login,
})

