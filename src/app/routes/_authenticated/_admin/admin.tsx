import { createFileRoute } from '@tanstack/react-router';
import { Admin } from '../../../../pages/admin/Admin';

export const Route = createFileRoute('/_authenticated/_admin/admin')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Admin />;
}
