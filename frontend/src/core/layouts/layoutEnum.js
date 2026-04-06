export const LAYOUT = Object.freeze({
  LEFT_MENU: 'left-menu',
  HEADER_FOOTER: 'header-footer',
  BLANK: 'blank'
});

const LAYOUT_VALUES = new Set(Object.values(LAYOUT));

export function normalizeLayout(layout, fallback = LAYOUT.LEFT_MENU) {
  if (LAYOUT_VALUES.has(layout)) {
    return layout;
  }

  return fallback;
}

