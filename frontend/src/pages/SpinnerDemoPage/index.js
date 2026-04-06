import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import { LAYOUT } from '@core/layouts';

export { default } from './SpinnerDemoPage';

export const routeMeta = {
  path: '/spinner-demo',
  title: 'Spinner Demo',
  layout: LAYOUT.LEFT_MENU,
  order: 10,
  leftMenu: {
    label: 'Spinner Demo',
    icon: AutorenewRoundedIcon,
    order: 10
  }
};
