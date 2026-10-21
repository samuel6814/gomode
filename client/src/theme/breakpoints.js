export const BP = {
  xs: '480px',     // Compact mobile
  mobile: '480px', // Backward compatibility
  sm: '640px',     // Standard mobile
  tablet: '768px', // Tablet boundary
  md: '768px',     // Tablet portrait
  desktop: '1024px', // Desktop boundary
  lg: '1024px',    // Desktop / Tablet landscape
  wide: '1280px',  // Standard widescreen
  xl: '1280px',
  xxl: '1536px',   // Large monitors
};

export const media = {
  // Mobile tiers
  small: `(max-width: ${BP.xs})`,
  mobile: `(max-width: ${BP.tablet})`,
  mobileOnly: `(max-width: 767px)`,
  sm: `(max-width: ${BP.sm})`,

  // Tablet tiers
  tablet: `(min-width: ${BP.tablet}) and (max-width: 1023px)`,
  tabletOnly: `(min-width: 768px) and (max-width: 1023px)`,
  tabletUp: `(min-width: ${BP.tablet})`,

  // Desktop tiers
  desktop: `(min-width: ${BP.desktop})`,
  desktopUp: `(min-width: ${BP.desktop})`,
  desktopOnly: `(min-width: 1024px) and (max-width: 1279px)`,
  wide: `(min-width: ${BP.wide})`,
  xl: `(min-width: ${BP.xl})`,
  xxl: `(min-width: ${BP.xxl})`,
};
