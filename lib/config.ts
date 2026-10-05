// Demo mode is the default: reviewing this repository never calls a live rewards service.
export const DEMO_MODE = process.env.EXPO_PUBLIC_DEMO_MODE !== 'false';
export const API_URL = process.env.EXPO_PUBLIC_API_URL || '';
export const FRONTEND_URL = process.env.EXPO_PUBLIC_FRONTEND_URL || '';
