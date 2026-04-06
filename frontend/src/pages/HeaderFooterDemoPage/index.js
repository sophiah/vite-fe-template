import { LAYOUT } from '@core/layouts';

export { default } from './HeaderFooterDemoPage';

export const routeMeta = {
  path: '/header-footer-demo',
  title: 'Header Footer Demo',
  layout: LAYOUT.HEADER_FOOTER,
  order: 20,
  headerNav: {
    label: 'Landing',
    order: 10
  }
};
