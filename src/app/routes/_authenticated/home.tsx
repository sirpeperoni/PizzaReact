import { createFileRoute } from '@tanstack/react-router'
import { Home } from '../../../pages/home/Home'

export const Route = createFileRoute('/_authenticated/home')({
  component: Home,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/home"!</div>
}
