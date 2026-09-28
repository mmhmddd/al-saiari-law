export const API_ENDPOINTS = {
  auth: { login: '/auth/login', register: '/auth/register', me: '/auth/me', logout: '/auth/logout', forgot: '/auth/forgot-password', reset: '/auth/reset-password', profile: '/auth/profile', changePassword: '/auth/change-password' },
  users: '/admin/users', articles: '/admin/articles', services: '/admin/services', consultations: '/admin/consultations',
  homepage: '/admin/homepage', settings: '/admin/settings', notifications: '/admin/notifications', contacts: '/admin/contact',
} as const;
