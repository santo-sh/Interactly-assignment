require('dotenv').config();

const CONFIG = {
  APP: {
    PORT: process.env.PORT || 3000,
    ENV: process.env.NODE_ENV ||'dev'
  },
  DB : {
    user: process.env.DB_USER || 'root',
    host: process.env.DB_HOST || 'localhost',
    name: process.env.DB_NAME || 'interactly',
    password: process.env.DB_PASSWORD || 'root',
  },
  token: process.env.FRESHWORK_TOKEN || '',
  freshwork_baseUrl: process.env.FRESHWORK_DOMAIN || ''
}

module.exports = CONFIG;