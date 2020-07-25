import React from 'react';
import { LOADING_TEXT, DATA_TESTIDS } from 'src/constants';

export function FallbackLoader() {
  return (
    <div data-testid={DATA_TESTIDS.fallbackLoader}>
      {LOADING_TEXT}
    </div>
  );
};
