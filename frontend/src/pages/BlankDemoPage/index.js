import { LAYOUT } from '@core/layouts';

export { default } from './BlankDemoPage';

export const routeMeta = {
  path: '/blank-demo',
  title: 'Blank Layout Demo',
  layout: LAYOUT.BLANK,
  order: 30,
  headerNav: {
    label: 'Blank',
    order: 20
  }
};
