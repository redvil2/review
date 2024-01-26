import { HeadFC } from 'gatsby';
import React from 'react';

import { APP_REGION } from '../constants';
import { IndexContent } from '../contents/HomePage';
import '../fonts';
import Layout from '../layouts';
import { HeaderFooter } from '../layouts/HeaderFooter';

export function Index() {
  return (
    <Layout>
      <HeaderFooter>
        <IndexContent />
      </HeaderFooter>
    </Layout>
  );
}

export default Index;

export const Head: HeadFC = () => (
  <title>{APP_REGION === 'china' ? '云QR' : 'A4LCloud'}</title>
);
