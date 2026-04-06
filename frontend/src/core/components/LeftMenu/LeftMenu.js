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
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { APP_CONFIG } from '@root/Config';
import {
  collapsedFlyoutPaperSx,
  collapsedIconRowSx,
  collapsedMenuLabelSx,
  getCollapsedChevronSx,
  getCollapsedFlyoutItemSx,
  getLeftMenuItemSx
} from './subcomponents/menuSx';

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

function findNodeByKey(nodes = [], nodeKey) {
  for (const node of nodes) {
    if (node.key === nodeKey) {
      return node;
    }

    if (node.children?.length) {
      const foundNode = findNodeByKey(node.children, nodeKey);

      if (foundNode) {
        return foundNode;
      }
    }
  }

  return null;
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
  const compactBrandLabel = brandLabel
    ? brandLabel.trim().charAt(0).toUpperCase()
    : APP_CONFIG.LEFT_MENU_COMPACT_FALLBACK;

  const autoExpandedNodeMap = React.useMemo(
    () => collectAutoExpandedNodeMap(items, pathname),
    [items, pathname]
  );

  const [expandedNodeMap, setExpandedNodeMap] = React.useState({});

  // Cascading flyouts: each level contains a node whose children are rendered in that popover.
  const [flyoutLevels, setFlyoutLevels] = React.useState([]);

  React.useEffect(() => {
    setExpandedNodeMap((currentMap) => ({
      ...autoExpandedNodeMap,
      ...currentMap
    }));
  }, [autoExpandedNodeMap]);

  const closeFlyouts = React.useCallback(() => {
    setFlyoutLevels([]);
  }, []);

  React.useEffect(() => {
    if (!collapsed) {
      closeFlyouts();
    }
  }, [collapsed, closeFlyouts]);

  React.useEffect(() => {
    closeFlyouts();
  }, [pathname, closeFlyouts]);

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

  const openRootFlyout = React.useCallback((nodeKey, anchorEl) => {
    setFlyoutLevels((currentLevels) => {
      if (currentLevels.length === 1 && currentLevels[0].nodeKey === nodeKey) {
        return [];
      }

      return [{ nodeKey, anchorEl }];
    });
  }, []);

  const openChildFlyout = React.useCallback((parentLevelIndex, nodeKey, anchorEl) => {
    setFlyoutLevels((currentLevels) => {
      const nextLevels = currentLevels.slice(0, parentLevelIndex + 1);
      const nextLevel = { nodeKey, anchorEl };
      nextLevels.push(nextLevel);

      return nextLevels;
    });
  }, []);

  const trimFlyoutsAfterLevel = React.useCallback((levelIndex) => {
    setFlyoutLevels((currentLevels) => currentLevels.slice(0, levelIndex + 1));
  }, []);

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

      const handleItemClick = (event) => {
        if (collapsed && hasChildren) {
          openRootFlyout(node.key, event.currentTarget);
          return;
        }

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
              onClick={(event) => handleItemClick(event)}
              onMouseEnter={(event) => {
                if (collapsed && hasChildren) {
                  setFlyoutLevels([{ nodeKey: node.key, anchorEl: event.currentTarget }]);
                }
              }}
            >
              {collapsed ? (
                <>
                  <Box sx={collapsedIconRowSx}>
                    {MenuIcon && (
                      <MenuIcon
                        fontSize="small"
                        sx={{ color: isActive ? 'common.white' : 'text.secondary' }}
                      />
                    )}
                    {hasChildren && <ChevronRightRoundedIcon sx={getCollapsedChevronSx(isActive)} />}
                  </Box>
                  <ListItemText primary={node.label} sx={collapsedMenuLabelSx} />
                </>
              ) : (
                <>
                  {MenuIcon && (
                    <ListItemIcon>
                      <MenuIcon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={node.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: {
                        fontWeight: isActive ? 700 : 600,
                        lineHeight: 1.2
                      }
                    }}
                  />
                </>
              )}

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

  const renderFlyoutLevel = (level, levelIndex) => {
    const currentNode = findNodeByKey(items, level.nodeKey);
    const nodes = currentNode?.children || [];

    return (
      <Popover
        key={`flyout-level-${levelIndex}-${level.nodeKey}`}
        open={Boolean(level.anchorEl && nodes.length)}
        anchorEl={level.anchorEl}
        onClose={closeFlyouts}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          elevation: 8,
          sx: collapsedFlyoutPaperSx
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 3 + levelIndex
        }}
      >
        <Box sx={{ px: 0.6, pb: 0.8 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, px: 0.9, py: 0.4 }}>
            {currentNode?.label || ''}
          </Typography>
        </Box>
        <List disablePadding>
          {nodes.map((node) => {
            const hasChildren = Boolean(node.children?.length);
            const isActive = isPathActive(pathname, node.path) || doesNodeContainActivePath(node, pathname);

            return (
              <ListItem key={`flyout-${levelIndex}-${node.key}`} disablePadding>
                <ListItemButton
                  onClick={(event) => {
                    if (hasChildren) {
                      openChildFlyout(levelIndex, node.key, event.currentTarget);
                      return;
                    }

                    if (node.path) {
                      onNavigate(node.path);
                      closeFlyouts();
                    }
                  }}
                  onMouseEnter={(event) => {
                    if (hasChildren) {
                      openChildFlyout(levelIndex, node.key, event.currentTarget);
                    } else {
                      trimFlyoutsAfterLevel(levelIndex);
                    }
                  }}
                  sx={getCollapsedFlyoutItemSx(isActive)}
                >
                  <Typography
                    variant="body1"
                    color={isActive ? 'text.primary' : 'text.secondary'}
                    sx={{ fontWeight: isActive ? 700 : 500 }}
                  >
                    {node.label}
                  </Typography>
                  {hasChildren && <ChevronRightRoundedIcon fontSize="small" color="action" />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Popover>
    );
  };

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
      <List variant={collapsed ? 'left-menu-collapsed' : 'left-menu'}>
        {renderMenuNodes(items)}
      </List>

      {collapsed && flyoutLevels.map((level, levelIndex) => renderFlyoutLevel(level, levelIndex))}
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
