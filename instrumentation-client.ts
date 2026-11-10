import { analytics } from '@heycatch/sdk';

analytics.init({
  projectKey: 'hck_pk_a-4k0Hrl3Y8200aU3SfZ66UYVAFJoubk',
  // Default batching holds events for 3s. Visits here are short and often end
  // in a full page load to app.draftly.blog (sign-up) or a closed tab, and the
  // SDK's docs note iOS Safari drops the batch as the page is torn down. 250ms
  // still batches but rarely loses the pageview.
  flushIntervalMs: 250,
  install: {
    framework: 'nextjs',
    frameworkVersion: '16',
    agent: 'claude-code',
  },
});
