import {
  _id,
  _times,
  _fullName,
} from './_mock';

// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: 'Jasmine Deux',
  email: 'jasmine_deux@gmail.com',
  photoURL: '/assets/images/avatar/avatar-1.webp',
};



// ----------------------------------------------------------------------

const COLORS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------


export type CountryType = 'br' | 'us' | 'eg' | 'vt' | 'au' | 'ca' | 'fr' | 'ch' | 'al' ;

export const _langs: { value: CountryType; label: string; icon: string }[] = [
  { value: 'br', label: 'local (Brésil)', icon: '/assets/icons/flags/ic-flag-br.svg' },
  { value: 'us', label: 'Etats-Unis', icon: '/assets/icons/flags/ic-flag-us.svg' },
  { value: 'eg', label: 'Egypte', icon: '/assets/icons/flags/ic-flag-eg.svg' },
  { value: 'vt', label: 'Vietnam', icon: '/assets/icons/flags/ic-flag-vt.svg' },
  { value: 'au', label: 'Australie', icon: '/assets/icons/flags/ic-flag-au.svg' },
  { value: 'ca', label: 'Canada', icon: '/assets/icons/flags/ic-flag-ca.svg' },
  { value: 'fr', label: 'France', icon: '/assets/icons/flags/ic-flag-fr.svg' },
  { value: 'ch', label: 'Chine', icon: '/assets/icons/flags/ic-flag-ch.svg' },
  { value: 'al', label: 'All Sites', icon: '/assets/icons/flags/ic-flag-al.svg' },

];


export type ServiceType =
  | 'Finance'
  | 'Juridique'
  | 'Direction générale'
  | 'Achats'
  | 'Informatique'
  | 'Collecte'
  | 'Assistance technique';

// ----------------------------------------------------------------------

export type TableType =
  | 'Personnel'
  | 'Operations'
  | 'Surveillance'
  | 'Formations'
  | 'Articles';


// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(1),
    title: 'Your order is placed',
    description: 'waiting for shipping',
    avatarUrl: null,
    type: 'order-placed',
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: _fullName(2),
    description: 'answered to your comment on the Innov3D channel',
    avatarUrl: '/assets/images/avatar/avatar-2.webp',
    type: 'friend-interactive',
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: 'You have new message',
    description: '5 unread messages',
    avatarUrl: null,
    type: 'chat-message',
    postedAt: _times(3),
    isUnRead: false,
  },
  {
    id: _id(4),
    title: 'You have new mail',
    description: 'sent from Guido Padberg',
    avatarUrl: null,
    type: 'mail',
    postedAt: _times(4),
    isUnRead: false,
  },
  {
    id: _id(5),
    title: 'Delivery processing',
    description: 'Your order is being shipped',
    avatarUrl: null,
    type: 'order-shipped',
    postedAt: _times(5),
    isUnRead: false,
  },
];




// -------------------------------
// API Adapters
// -------------------------------



// --- Juridique ---
export type MaxPerSite = {
  identifiant: string;
  responsable: string;
  total_personnel: number;
  country: string;
};

// --- Informatique ---
export type NbSiteNonInfo = {
  identifiant: string;
  site: string;
  total_sites: number;
  source: string;
};

// --- Collecte ---
export type ZoneAudit = {
  identifiant: string;
  pourcentage: number;
  source: string;
};

// --- Achats ---
export type empAchat = {
  total_empl_achat: number;
  breakdown?: { source: string; employees: number }[];
};

// --- Direction Générale ---
export type DGPersonnel = {
  total_employees: number;
  breakdown?: { country: string; employees: number }[];
};


// Juridique
export const JuridiqueAdapters: Record<string, (d: any) => MaxPerSite> = {
  canada: (d) => ({
    identifiant: d.identifiant,
    responsable: d.responsable,
    total_personnel: d.total_personnel,
    country: 'canada',
  }),
  australie: (d) => ({
    identifiant: d.id_site ?? d.identifiant,
    responsable: d.manager ?? d.responsable,
    total_personnel: d.max_staff ?? d.total_personnel,
    country: 'australie',
  }),
};

// Informatique
export const InformatiqueAdapters: Record<string, (d: any) => NbSiteNonInfo> = {
  egypte: (d) => ({
    identifiant: d.identifiant,
    site: d.site,
    total_sites: d.total_sites,
    source: 'egypte',
  }),
  vietnam: (d) => ({
    identifiant: d.id ?? d.identifiant,
    site: d.nom_site ?? d.site,
    total_sites: d.nb ?? d.total_sites,
    source: 'vietnam',
  }),
};

// Collecte
export const CollecteAdapters: Record<string, (d: any) => ZoneAudit> = {
  canada: (d) => ({
    identifiant: d.identifiant,
    pourcentage: d.pourcentage,
    source: 'canada',
  }),
  france: (d) => ({
    identifiant: d.id ?? d.identifiant,
    pourcentage: d.audit_percentage ?? d.pourcentage,
    source: 'france',
  }),
};