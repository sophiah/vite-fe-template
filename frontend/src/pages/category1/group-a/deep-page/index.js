export { default } from './DeepPage';

export const routeMeta = {
  title: 'Deep Page',
  order: 121,
  permission: {
    public: false,
    auth: true,
    ability: 'read',
    subject: 'deep-page'
  },
  leftMenu: {
    label: 'Deep Page',
    order: 121
  }
};
