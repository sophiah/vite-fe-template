export const getLeftMenuItemSx = (isActive, collapsed) => ({
  px: collapsed ? 1 : 1.5,
  py: 1,
  mb: 0.5,
  justifyContent: collapsed ? 'center' : 'flex-start',
  fontWeight: isActive ? 700 : 600,
  bgcolor: isActive ? 'primary.main' : 'transparent',
  color: isActive ? 'common.white' : 'text.primary',
  '& .MuiListItemIcon-root': {
    color: isActive ? 'common.white' : 'text.secondary',
    minWidth: collapsed ? 0 : 36,
    mr: collapsed ? 0 : 1
  },
  '&:hover': {
    bgcolor: isActive ? 'primary.dark' : 'action.hover'
  }
});
