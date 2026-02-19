import { createFileRoute, redirect } from '@tanstack/react-router'
import { Home } from '../../pages/Home';

export const Route = createFileRoute('/_authenticated/home')({
  beforeLoad: ({ context, location }) => {

    if (!context.auth.user && location.pathname === '/home') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Home,
})