// API and app configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const config = {
  apiBaseUrl: API_BASE_URL,
  appName: 'CloudSwitch',
  appVersion: '1.0.0',
  tokenKey: 'cloudswitch_token',
  userKey: 'cloudswitch_user',
};

export default config;
