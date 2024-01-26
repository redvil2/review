require('dotenv').config({
  path: `${__dirname}/../../.env`,
});

module.exports = {
  siteMetadata: {
    title: `websites/landing`,
    description: `This is a gatsby application created by Nx.`,
  },
  jsxRuntime: `automatic`,
  plugins: [
    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        svgo: false,
        ref: true,
      },
    },
    `gatsby-plugin-typescript`,
    'gatsby-plugin-tsconfig-paths',
    'gatsby-plugin-styled-components',
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `websites/landing`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#dae2ff`,
        theme_color: `#dae2ff`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    },
  ],
};
