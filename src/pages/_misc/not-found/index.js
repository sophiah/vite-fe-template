export { default } from './NotFoundPage';

export const routeMeta = {
  path: '*',
  aliases: ['/404'],
  title: 'Page Not Found',
  layout: 'blank',
  order: -1,
  kind: 'not-found',
  permissions: [],
  leftMenu: false,
  headerNav: false
};
