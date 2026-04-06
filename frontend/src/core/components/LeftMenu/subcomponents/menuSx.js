export const getLeftMenuItemSx = (isActive, collapsed) => ({
  px: collapsed ? 0.5 : 1.5,
  py: collapsed ? 1 : 1,
  mb: 0.5,
  justifyContent: collapsed ? 'center' : 'flex-start',
  flexDirection: collapsed ? 'column' : 'row',
  alignItems: 'center',
  borderRadius: collapsed ? 2.5 : 2,
  position: 'relative',
  fontWeight: isActive ? 700 : 600,
  bgcolor: isActive ? 'primary.main' : 'transparent',
  color: isActive ? 'common.white' : 'text.primary',
  '& .MuiListItemIcon-root': {
    color: isActive ? 'common.white' : 'text.secondary',
    minWidth: collapsed ? 0 : 36,
    mr: collapsed ? 0 : 1,
    mb: collapsed ? 0.55 : 0
  },
  '&:hover': {
    bgcolor: isActive ? 'primary.dark' : 'action.hover'
  }
});

export const collapsedIconRowSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  mb: 0.55
};

export const collapsedMenuLabelSx = {
  opacity: 1,
  display: 'block',
  textAlign: 'center',
  '& .MuiTypography-root': {
    fontSize: '0.74rem',
    lineHeight: 1.15,
    fontWeight: 700
  }
};

export const getCollapsedChevronSx = (isActive) => ({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: 17,
  lineHeight: 1,
  color: isActive ? 'common.white' : 'text.secondary',
  opacity: isActive ? 0.95 : 0.75
});

export const collapsedFlyoutPaperSx = {
  ml: 1.2,
  mt: -0.5,
  width: 280,
  p: 1.2,
  borderRadius: 3,
  bgcolor: 'background.paper'
};

export const getCollapsedFlyoutItemSx = (isActive) => ({
  borderRadius: 1.5,
  px: 1.5,
  py: 0.9,
  mb: 0.4,
  justifyContent: 'space-between',
  bgcolor: isActive ? 'action.selected' : 'transparent',
  '&:hover': {
    bgcolor: 'action.hover'
  }
});
