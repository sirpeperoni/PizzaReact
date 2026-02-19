import { createFileRoute, redirect } from '@tanstack/react-router'
import { Register } from '../pages/Register/Register'

export const Route = createFileRoute("/register")({
  beforeLoad: ({ context, search }) => {
    
    if (context.auth.user) {
      throw redirect({ to: '/' })
    }
  },
  component: Register,
})

