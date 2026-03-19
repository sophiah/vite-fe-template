import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';

export { default } from './DashboardPage';

export const routeMeta = {
  path: '/',
  title: 'Dashboard Demo',
  layout: 'left-menu',
  order: 0,
  permissions: [],
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
