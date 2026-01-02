import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { _myAccount } from 'src/_mytypes/_data';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(_myAccount.email);
  const [password, setPassword] = useState('@apprep1234');
  const [error, setError] = useState('');

  const handleSignIn = useCallback(() => {
    if (email === _myAccount.email && password === '@apprep1234') {
      setError('');
      router.push('/dashboard');
    } else {
      setError('Email ou mot de passe incorrect.');
    }
  }, [email, password, router]);

  const renderForm = (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
      <TextField
        fullWidth
        name="email"
        label="Adresse e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Mot de passe oublié ?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 1 }}
      />

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Se connecter
      </Button>
    </Box>
  );

  return (
    <>
      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
        <Typography variant="h5">Se connecter</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Pas de compte ?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Inscrivez-vous
          </Link>
        </Typography>
      </Box>
      {renderForm}
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}>
          OU
        </Typography>
      </Divider>
      <Box sx={{ gap: 1, display: 'flex', justifyContent: 'center' }}>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:google" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:github" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:twitter" />
        </IconButton>
      </Box>
    </>
  );
}

