import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getLeftMenuItemSx } from './subcomponents/menuSx';

const DRAWER_PAPER_SX = (drawerWidth) => ({
  width: drawerWidth,
  boxSizing: 'border-box',
  overflowX: 'hidden',
  transition: (theme) =>
    theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter
    })
});

function isPathActive(pathname, itemPath) {
  if (!itemPath) {
    return false;
  }

  if (itemPath === '/') {
    return pathname === '/';
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function doesNodeContainActivePath(node, pathname) {
  if (isPathActive(pathname, node.path)) {
    return true;
  }

  if (!node.children?.length) {
    return false;
  }

  return node.children.some((childNode) => doesNodeContainActivePath(childNode, pathname));
}

function collectAutoExpandedNodeMap(items, pathname) {
  const expandedMap = {};

  const walk = (node) => {
    if (!node.children?.length) {
      return isPathActive(pathname, node.path);
    }

    const isCurrentActive = isPathActive(pathname, node.path);
    const hasActiveChild = node.children.some((childNode) => walk(childNode));

    if (isCurrentActive || hasActiveChild) {
      expandedMap[node.key] = true;
    }

    return isCurrentActive || hasActiveChild;
  };

  items.forEach((item) => walk(item));

  return expandedMap;
}

function LeftMenuContent({
  brandLabel,
  items,
  pathname,
  onNavigate,
  collapsed = false,
  isDesktop = false,
  onToggleDesktop,
  onCloseMobile
}) {
  const compactBrandLabel = brandLabel ? brandLabel.trim().charAt(0).toUpperCase() : 'R';
  const autoExpandedNodeMap = React.useMemo(
    () => collectAutoExpandedNodeMap(items, pathname),
    [items, pathname]
  );
  const [expandedNodeMap, setExpandedNodeMap] = React.useState({});

  React.useEffect(() => {
    setExpandedNodeMap((currentMap) => ({
      ...autoExpandedNodeMap,
      ...currentMap
    }));
  }, [autoExpandedNodeMap]);

  const handleToggleNode = React.useCallback(
    (nodeKey) => {
      setExpandedNodeMap((currentMap) => {
        const currentValue = currentMap[nodeKey] ?? autoExpandedNodeMap[nodeKey] ?? false;

        return {
          ...currentMap,
          [nodeKey]: !currentValue
        };
      });
    },
    [autoExpandedNodeMap]
  );

  const renderMenuNodes = (nodes, depth = 0) => (
    nodes.map((node) => {
      const hasChildren = Boolean(node.children?.length);
      const isCollapsedChild = collapsed && depth > 0;

      if (isCollapsedChild) {
        return null;
      }

      const isSelfActive = isPathActive(pathname, node.path);
      const isBranchActive = hasChildren && doesNodeContainActivePath(node, pathname);
      const isActive = isSelfActive || isBranchActive;
      const isExpanded = !collapsed && (expandedNodeMap[node.key] ?? autoExpandedNodeMap[node.key] ?? false);
      const MenuIcon = node.icon;

      const handleItemClick = () => {
        if (node.path) {
          onNavigate(node.path);
          return;
        }

        if (hasChildren) {
          handleToggleNode(node.key);
        }
      };

      return (
        <React.Fragment key={node.key}>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                ...getLeftMenuItemSx(isActive, collapsed),
                pl: collapsed ? 1 : (1.5 + depth * 1.5)
              }}
              onClick={handleItemClick}
            >
              {MenuIcon && (
                <ListItemIcon>
                  <MenuIcon fontSize="small" />
                </ListItemIcon>
              )}
              <ListItemText
                primary={node.label}
                sx={{
                  opacity: collapsed ? 0 : 1,
                  display: collapsed ? 'none' : 'block'
                }}
              />
              {hasChildren && !collapsed && (
                <IconButton
                  size="small"
                  aria-label={isExpanded ? 'collapse section' : 'expand section'}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggleNode(node.key);
                  }}
                >
                  {isExpanded ? (
                    <ExpandLessRoundedIcon fontSize="small" />
                  ) : (
                    <ExpandMoreRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              )}
            </ListItemButton>
          </ListItem>

          {hasChildren && !collapsed && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List disablePadding>
                {renderMenuNodes(node.children, depth + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    })
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: collapsed ? 1.5 : 2.5, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          <Typography variant={collapsed ? 'h4' : 'h5'} textAlign={collapsed ? 'center' : 'left'}>
            {collapsed ? compactBrandLabel : brandLabel}
          </Typography>
          {isDesktop && onToggleDesktop && !collapsed && (
            <Tooltip title="Collapse menu">
              <IconButton aria-label="collapse menu" size="small" onClick={onToggleDesktop}>
                <ChevronLeftRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
          {isDesktop && onToggleDesktop && collapsed && (
            <Tooltip title="Expand menu">
              <IconButton aria-label="expand menu" size="small" onClick={onToggleDesktop}>
                <ChevronRightRoundedIcon />
              </IconButton>
            </Tooltip>
          )}
          {!isDesktop && onCloseMobile && (
            <IconButton aria-label="close menu" size="small" onClick={onCloseMobile}>
              <CloseRoundedIcon />
            </IconButton>
          )}
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, display: collapsed ? 'none' : 'block' }}
        >
          Drawer navigation layout
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1.5, py: 1.5 }}>
        {renderMenuNodes(items)}
      </List>
    </Box>
  );
}

export default function LeftMenu({
  brandLabel,
  items,
  drawerWidth,
  collapsedWidth = 88,
  desktopOpen = true,
  onToggleDesktop,
  mobileOpen,
  onOpenMobile,
  onCloseMobile
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const desktopDrawerWidth = desktopOpen ? drawerWidth : collapsedWidth;

  const handleNavigate = (path) => {
    navigate(path);
    onCloseMobile();
  };

  return (
    <Box component="nav" sx={{ width: { md: desktopDrawerWidth }, flexShrink: { md: 0 } }}>
      <Box
        sx={{
          position: 'fixed',
          top: 14,
          left: 12,
          zIndex: (theme) => theme.zIndex.drawer + 2,
          display: { xs: mobileOpen ? 'none' : 'block', md: 'none' }
        }}
      >
        <Tooltip title="Open menu">
          <IconButton aria-label="open menu" onClick={onOpenMobile} sx={{ bgcolor: 'background.paper' }}>
            <MenuRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': DRAWER_PAPER_SX(drawerWidth)
        }}
      >
        <LeftMenuContent
          brandLabel={brandLabel}
          items={items}
          pathname={location.pathname}
          onNavigate={handleNavigate}
          collapsed={false}
          isDesktop={false}
          onCloseMobile={onCloseMobile}
        />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': DRAWER_PAPER_SX(desktopDrawerWidth)
        }}
      >
        <LeftMenuContent
          brandLabel={brandLabel}
          items={items}
          pathname={location.pathname}
          onNavigate={handleNavigate}
          collapsed={!desktopOpen}
          isDesktop
          onToggleDesktop={onToggleDesktop}
        />
      </Drawer>
    </Box>
  );
}
