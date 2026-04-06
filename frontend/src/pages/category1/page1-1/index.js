import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

export { default } from './Page1_1Page';

export const routeMeta = {
  title: 'Page 1-1',
  order: 101,
  permission: {
    public: false,
    auth: true,
    ability: 'read',
    subject: 'category1'
  },
  leftMenu: {
    label: 'Page 1-1',
    icon: DescriptionRoundedIcon,
    order: 101
  }
};
