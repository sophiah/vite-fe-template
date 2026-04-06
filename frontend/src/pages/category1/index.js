import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

export { default } from './Category1Page';

export const routeMeta = {
  title: 'Category 1',
  order: 100,
  layout: 'left-menu',
  permissions: ['category1:read'],
  leftMenu: {
    label: 'Category 1',
    icon: FolderRoundedIcon,
    order: 100
  }
};
