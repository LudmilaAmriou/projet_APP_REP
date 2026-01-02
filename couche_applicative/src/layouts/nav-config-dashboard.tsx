import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Mise à jour - Data',
    path: '/mise-a-jour-data',
    icon: icon('ic-blog'),
       info: (
      <Label color="success" variant="inverted">
        ✔ 5 
      </Label>
    ),
  },
  // {
  //   title: 'Se connecter',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Non trouvé',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
