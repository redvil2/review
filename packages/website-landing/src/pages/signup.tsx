import { HeadFC } from 'gatsby';
import React from 'react';

import { StartNowContent } from '../contents/StartNow';
import Layout from '../layouts';
import { HeaderFooter } from '../layouts/HeaderFooter';

export function StartNow() {
  return (
    <Layout>
      <HeaderFooter withoutMenu>
        <StartNowContent />
      </HeaderFooter>
    </Layout>
  );
}

export default StartNow;

export const Head: HeadFC = () => <title>Start now</title>;
