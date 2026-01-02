import type { LinkProps } from '@mui/material/Link';

import { useId } from 'react';

import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

// import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = true,
  ...other
}: LogoProps) {
  const theme = useTheme();
  const gradientId = useId();

  // Theme Variables
  const TEXT_PRIMARY = theme.vars.palette.text.primary;
  const PRIMARY_MAIN = theme.vars.palette.primary.main;
  const PRIMARY_DARK = theme.vars.palette.primary.dark;

  // ICON ONLY (Isometric 3D Cube)
  const singleLogo = (
    <svg width="100%" height="100%" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${gradientId}-cube`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={PRIMARY_MAIN} />
          <stop offset="100%" stopColor={PRIMARY_DARK} />
        </linearGradient>
      </defs>
      {/* Top Face */}
      <path d="M256 64l160 92-160 92-160-92z" fill={PRIMARY_MAIN} opacity="0.85" />
      {/* Right Face */}
      <path d="M256 248l160-92v184l-160 92z" fill={`url(#${gradientId}-cube)`} />
      {/* Left Face */}
      <path d="M96 156l160 92v184l-160-92z" fill={PRIMARY_DARK} />
    </svg>
  );

  // FULL LOGO (Icon + Innov3D Text)
  const fullLogo = (
    <svg width="100%" height="100%" viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mini Icon */}
      <g transform="translate(0, 10) scale(0.12)">
        <path d="M256 64l160 92-160 92-160-92z" fill={PRIMARY_MAIN} />
        <path d="M256 248l160-92v184l-160 92z" fill={PRIMARY_DARK} />
        <path d="M96 156l160 92v184l-160-92z" fill={PRIMARY_MAIN} opacity="0.7" />
      </g>
      
      {/* Typography */}
      <text
        x="65"
        y="52"
        fill={TEXT_PRIMARY}
        style={{ 
          font: 'bold 38px "Public Sans", sans-serif',
          letterSpacing: '-1px'
        }}
      >
        Innov
        <tspan fill={PRIMARY_MAIN}>3D</tspan>
      </text>
    </svg>
  );

  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="Innov3D Logo"
      underline="none"
      // className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: 40,
          height: 40,
          display: 'inline-flex',
          alignItems: 'center',
          transition: theme.transitions.create(['transform', 'opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': { opacity: 0.8 },
          ...(!isSingle && { width: 160, height: 48 }),
          ...(disabled && { pointerEvents: 'none', opacity: 0.5 }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {isSingle ? singleLogo : fullLogo}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'transparent',
  display: 'inline-flex',
  verticalAlign: 'middle',
}));
