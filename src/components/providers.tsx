'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ReactElement, ReactHTMLElement } from 'react';

const Providers = ({ children }: {
  children: React.ReactNode;
}) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="red"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
};

export default Providers;