import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

export function ComingSoonView() {
  return (
    <>
      <Logo sx={{ position: 'fixed', top: 20, left: 20 }} />

      <Container
        sx={{
          py: 10,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 2, textAlign: 'center' }}>
          Service en cours de développement
        </Typography>

        <Typography sx={{ color: 'text.secondary', maxWidth: 480, textAlign: 'center' }}>
          Cette fonctionnalité n&apos;est pas encore disponible. Nous y travaillons activement pour vous offrir la meilleure expérience.
        </Typography>

        <Box
          component="img"
          src="/assets/illustrations/illustration-dashboard.webp"
          sx={{
            width: 320,
            height: 'auto',
            my: { xs: 5, sm: 10 },
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
           <Button component={RouterLink} href="/dashboard" size="large" variant="outlined" color="inherit">
            Aller au Dashboard
          </Button>

          <Button component={RouterLink} href="/mise-a-jour-data" size="large" variant="contained" color="inherit">
            Aller à la mise à jour de données
          </Button>
         
        </Box>
     

        <Typography sx={{ mt: 3, color: 'text.secondary', textAlign: 'center', fontSize: 14 }}>
          Merci pour votre patience ! Restez à l&apos;affût des nouveautés.
        </Typography>
      </Container>
    </>
  );
}
