import { CONFIG } from 'src/config-global';

import { ComingSoonView } from 'src/sections/error';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Coming Soon! | Stay Tuned - ${CONFIG.appName}`}</title>

      <ComingSoonView />
    </>
  );
}
