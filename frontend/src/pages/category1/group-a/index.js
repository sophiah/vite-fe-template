import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';

export { default } from './GroupAPage';

export const routeMeta = {
  title: 'Group A',
  order: 120,
  permission: {
    public: false,
    auth: true,
    ability: 'read',
    subject: 'group-a'
  },
  leftMenu: {
    label: 'Group A',
    icon: AccountTreeRoundedIcon,
    order: 120
  }
};
