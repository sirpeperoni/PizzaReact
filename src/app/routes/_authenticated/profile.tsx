import { createFileRoute } from '@tanstack/react-router'
import { Profile } from '../../../pages/profile/Profile'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/profile"!</div>
}
