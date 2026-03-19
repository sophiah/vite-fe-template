import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';

export { default } from './Page1_1Page';

export const routeMeta = {
  title: 'Page 1-1',
  order: 101,
  permissions: ['category1:page1-1:read'],
  leftMenu: {
    label: 'Page 1-1',
    icon: DescriptionRoundedIcon,
    order: 101
  }
};
