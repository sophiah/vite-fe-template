import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import { LAYOUT } from '@core/layouts';

export { default } from './DashboardPage';

export const routeMeta = {
  path: '/',
  title: 'Dashboard Demo',
  layout: LAYOUT.LEFT_MENU,
  order: 0,
  permission: {
    public: true
  },
  leftMenu: {
    label: 'Dashboard Demo',
    icon: DashboardRoundedIcon,
    order: 0
  },
  headerNav: {
    label: 'Home',
    order: 0
  }
};
