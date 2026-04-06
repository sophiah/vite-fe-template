export const getMenuItemSx = (isActive) => ({
  mb: 0.5,
  borderRadius: 2,
  fontWeight: isActive ? 700 : 600,
  bgcolor: isActive ? 'primary.main' : 'transparent',
  color: isActive ? 'common.white' : 'text.primary',
  '& .MuiListItemIcon-root': {
    color: isActive ? 'common.white' : 'text.secondary',
    minWidth: 36
  },
  '&:hover': {
    bgcolor: isActive ? 'primary.dark' : 'action.hover'
  }
});
