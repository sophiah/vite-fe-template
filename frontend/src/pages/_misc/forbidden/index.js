export { default } from './ForbiddenPage';

export const routeMeta = {
  path: '/403',
  aliases: ['/forbidden'],
  title: 'Access Denied',
  layout: 'blank',
  order: -2,
  kind: 'forbidden',
  permissions: [],
  leftMenu: false,
  headerNav: false
};
