import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { _langs } from 'src/_mytypes/_data';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    id: string;
    title: string;
    coverUrl: string;
    description: string;
    source?: string;
    // postedAt: string | number | null;
  }[];
  initialLimit?: number; // nombre d'items affichés avant "View all"
};

export function AnalyticsNews({ title, subheader, list, initialLimit = 5, sx, ...other }: Props) {
  const [showAll, setShowAll] = useState(false);
  

  // limiter la liste si showAll = false
  const displayedList = showAll ? list : list.slice(0, initialLimit);

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 1 }} />

      <Scrollbar sx={{ minHeight: 405 }}>
        <Box sx={{ minWidth: 640 }}>
          {displayedList.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>

      {list.length > initialLimit && (
        <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button
            size="small"
            color="inherit"
            onClick={() => setShowAll((prev) => !prev)} // toggle true/false
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          >
            {showAll ? 'Collapse' : 'View all'}
          </Button>
        </Box>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = BoxProps & {
  item: Props['list'][number];
};

function Item({ item, sx, ...other }: ItemProps) {
  const lang = item.source ? _langs.find(l => l.label === item.source) : null;
  return (
    <Box
      sx={[
        (theme) => ({
          py: 2,
          px: 3,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Avatar
        variant="rounded"
        alt={item.title}
        src={item.coverUrl}
        sx={{ width: 48, height: 48, flexShrink: 0 }}
      />

      <ListItemText
        primary={<Link color="inherit">{item.title}</Link>}
        secondary={item.description}
        slotProps={{
          primary: { noWrap: true },
          secondary: {
            noWrap: true,
            sx: { mt: 0.5 },
          },
        }}
      />
       {/* Flag icon on the right */}
      {lang && (
        <Avatar
        
          src={lang.icon}
          alt={lang.label}
          sx={{ width: 40, height: 40, flexShrink: 0, ml: 2 }}
        />
      )}

      <Box sx={{ flexShrink: 0, typography: 'caption', color: 'text.disabled' }}>
        {/* {fToNow(item.postedAt)} */}
      </Box>
    </Box>
  );
}
