import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  extends: [
    '@adra-network/favicon-layer',
  ],
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt',
    "@adra-network/i18n-module",
    "@adra-network/feature-flag-module",
    // "@adra-network/ui-library/nuxt",
    // "@nuxtjs/i18n",
    // '@nuxtjs/sentry',
  ],
  adraFeatureFlag: {
    mock: true,
  },
  // adraI18n: {
  //   enabled: true, // Enable or disable the i18n features
  //   langDir: "lang", // Directory of language JSON files
  //   apiKey: "", // Your API key for the translation service
  // },
  pinia: {
    storesDirs: ['./store/**'],
  },
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en-US.js'
      },
      {
        code: 'es',
        file: 'es-ES.js'
      },
      {
        code: 'fr',
        file: 'fr-FR.js'
      }
    ],
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en'
  },
  // sentry: {
  //   dsn: process.env.NUXT_SENTRY_DSN || '',
  //   // https://sentry.nuxtjs.org/sentry/options
  //   config: {
  //     environment: process.env.NUXT_ENV || 'local',
  //     release:
  //       'aws-frontend-donation-receiver@' + process.env.NUXT_CI_COMMIT_SHORT_SHA,
  //   },
  // },
  adra: {
    fonts: {
      montserrat: true,
      zillaSlab: true,
      kaushanScript: false,
      authenia: false,
    },
    icons: {
      mdi: true,
      fa: false,
    },
    // vuetify: {
    //   treeShake: true,
    //   customVariables: ['~/assets/variables.scss'],
    // },
  },
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/variables.scss'],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      isDev: process.env.NUXT_IS_DEVELOPMENT == 'true' || false,
      ADRA_DEBUG: process.env.NUXT_ADRA_DEBUG == 'true' || false,
      STRIPE_PUBLISHABLE_KEY: process.env.NUXT_STRIPE_PUBLISHABLE_KEY,
      STRIPE_API_VERSION: process.env.NUXT_STRIPE_API_VERSION,
      STRIPE_API_BETAS: process.env.NUXT_STRIPE_API_BETAS,
      DONATION_PAGE_BASE_URL: process.env.NUXT_APP_URL,
      FINGERPRINT_JS_PK: process.env.NUXT_FINGERPRINT_JS_PK,
      UNLEASH_CLIENT_KEY: process.env.NUXT_UNLEASH_CLIENT_KEY,
      UNLEASH_URL:
        process.env.NUXT_UNLEASH_URL ||
        'https://us.app.unleash-hosted.com/usgg0024/api/frontend',
      COUNTRY_BASE_URL: process.env.NUXT_COUNTRY_BASE_URL,
      CAMPAIGN_BASE_URL: process.env.NUXT_CAMPAIGN_BASE_URL,
      PAYMENT_BASE_URL: process.env.NUXT_PAYMENT_BASE_URL,
      ASSET_BASE_URL: process.env.NUXT_ASSET_URL,
      IS_PRODUCTION: process.env.NUXT_NODE_ENV === 'production',
      SENTRY_SAMPLE_RATE: process.env.NUXT_SENTRY_SAMPLE_RATE || 0.1,
      FEATURES: {
        LIVE_PAYMENT: process.env.NUXT_FEATURES_LIVE_PAYMENT || true,
      },
    },
  }
})
