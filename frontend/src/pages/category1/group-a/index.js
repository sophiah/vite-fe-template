import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';

export { default } from './GroupAPage';

export const routeMeta = {
  title: 'Group A',
  order: 120,
  permissions: ['group-a:read'],
  leftMenu: {
    label: 'Group A',
    icon: AccountTreeRoundedIcon,
    order: 120
  }
};
