import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';

export { default } from './SpinnerDemoPage';

export const routeMeta = {
  path: '/spinner-demo',
  title: 'Spinner Demo',
  layout: 'left-menu',
  order: 10,
  leftMenu: {
    label: 'Spinner Demo',
    icon: AutorenewRoundedIcon,
    order: 10
  }
};
