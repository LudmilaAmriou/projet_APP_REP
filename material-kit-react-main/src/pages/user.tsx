import { CONFIG } from 'src/config-global';

import {OverviewTablesView} from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Mise à jour - Data - ${CONFIG.appName}`}</title>

      <OverviewTablesView />
    </>
  );
}
