import { createFileRoute } from '@tanstack/react-router';
import { Configurator } from '../../../pages/configurator/Configurator';

export const Route = createFileRoute('/_authenticated/configurator')({
  component: Configurator,
});
