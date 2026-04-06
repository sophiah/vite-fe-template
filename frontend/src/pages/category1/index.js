import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import { LAYOUT } from '@core/layouts';

export { default } from './Category1Page';

export const routeMeta = {
  title: 'Category 1',
  order: 100,
  layout: LAYOUT.LEFT_MENU,
  permissions: ['category1:read'],
  leftMenu: {
    label: 'Category 1',
    icon: FolderRoundedIcon,
    order: 100
  }
};
