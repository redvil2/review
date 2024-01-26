import { HeadFC } from 'gatsby';
import React from 'react';

import { ImprintContent } from '../contents/Imprint';
import Layout from '../layouts';
import { HeaderFooter } from '../layouts/HeaderFooter';

export function Index() {
  return (
    <Layout>
      <HeaderFooter>
        <ImprintContent />
      </HeaderFooter>
    </Layout>
  );
}

export default Index;

export const Head: HeadFC = () => <title>Home Page</title>;
