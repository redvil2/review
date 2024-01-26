import { HeadFC } from 'gatsby';
import React from 'react';

import { APP_REGION } from '../constants';
import { LanguagesContent } from '../contents/Languages';
import Layout from '../layouts';

export function Languages() {
  return (
    <Layout>
      <LanguagesContent />
    </Layout>
  );
}

export default Languages;

export const Head: HeadFC = () => (
  <title>{APP_REGION === 'china' ? '云QR' : 'A4LCloud'}</title>
);
