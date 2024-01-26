import { HeadFC } from 'gatsby';
import React from 'react';

import { APP_REGION } from '../constants';
import { WhatsNewContent } from '../contents/WhatsNew';
import Layout from '../layouts';
import { HeaderFooter } from '../layouts/HeaderFooter';

const WhatsNewPage = () => {
  return (
    <Layout>
      <HeaderFooter>
        <WhatsNewContent />
      </HeaderFooter>
    </Layout>
  );
};

export default WhatsNewPage;

export const Head: HeadFC = () => (
  <title>{APP_REGION === 'china' ? '云QR' : 'A4LCloud'}</title>
);
