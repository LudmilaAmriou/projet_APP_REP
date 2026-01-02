import type { IconButtonProps } from '@mui/material/IconButton';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

// ----------------------------------------------------------------------

export type LanguagePopoverProps = IconButtonProps & {
  data?: {
    value: string;
    label: string;
    icon: string;
  };
};

export function LanguagePopover({ data, sx, ...other }: LanguagePopoverProps) {
 
  const currentLang = data;

  const renderFlag = (label?: string, icon?: string) => (
    <Box
      component="img"
      alt={label}
      src={icon}
      sx={{ width: 26, height: 20, borderRadius: 0.5, objectFit: 'cover', mr: 1 }}
    />
  );

  return (
    <Tooltip title={`Vous êtes affecté au siège Innov3D ${currentLang?.label}`} arrow>
      <IconButton
        aria-label="Language button"
        sx={[
          { p: 0, width: 40, height: 40 },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {renderFlag(currentLang?.label, currentLang?.icon)}
      </IconButton>
    </Tooltip>
  );
}
