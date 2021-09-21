/**
 *
 * Asynchronously loads the component for Pipes
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Pipe = lazyLoad(
  () => import('./index'),
  module => module.Pipe,
);
