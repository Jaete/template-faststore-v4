
module.exports = {
  seo: {
  "title": "Minha Loja",
  "description": "Descrição da loja usada como meta description padrão.",
  "titleTemplate": "%s | Minha Loja",
  "author": "Minha Loja"
},

  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: process.env.NEXT_PUBLIC_STORE_ID || "mystore",
    workspace: 'master',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
    incrementAddress: false,
  },

  // Default session
  session: {
    currency: {
      code: "BRL",
      symbol: "R$",
    },
    locale: "pt-BR",
    channel: '{"salesChannel":1,"regionId":""}',
    country: "BRA",
    deliveryMode: null,
    addressType: null,
    postalCode: null,
    geoCoordinates: null,
    person: null,
  },

  cart: {
    id: '',
    items: [],
    messages: [],
    shouldSplitItem: true,
  },

  // Production URLs
  storeUrl: "https://mystore.vtex.app",
  secureSubdomain: "https://secure.vtexfaststore.com/",
  checkoutUrl: "https://secure.vtexfaststore.com/checkout",
  loginUrl: "https://secure.vtexfaststore.com/api/io/login",
  accountUrl: "https://secure.vtexfaststore.com/api/io/account",

  previewRedirects: {
    home: '/',
    plp: "/office",
    search: "/s?q=camisa",
    pdp: "/produto-exemplo/p",
  },

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:3000',
    pages: {
      home: '/',
      pdp: "/produto-exemplo/p",
      collection: "/office",
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: "/produto-exemplo/p",
      collection: "/office",
      collection_filtered: "/office/?category-1=office&facets=category-1",
      search: "/s?q=camisa",
    },
    browser: 'electron',
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: "",
  },

  experimental: {
    nodeVersion: 18,
    cypressVersion: 12,
    scrollRestoration: true,
  },

  contentSource: {
    type: 'CP',
    project: "store",
  },
}
