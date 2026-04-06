export const getAppBoxSx = (gradientEnabled) => ({
  p: { xs: 2, md: 3 },
  borderRadius: 3,
  height: '100%',
  ...(gradientEnabled
    ? { background: 'linear-gradient(135deg, var(--capp-hero-start), var(--capp-hero-end))' }
    : { backgroundColor: 'background.paper' })
});
