// src/contentfulClient.jsx
import { createClient } from 'contentful';

const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

const client = space && accessToken
  ? createClient({ space, accessToken })
  : {
      getEntries: () => Promise.reject(
        new Error('Contentful is not configured. Add VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN.')
      ),
    };

export default client;
