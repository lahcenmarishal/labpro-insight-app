import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.labproinsight',
  appName: 'LabPro Insight',
  webDir: 'dist',
  server: {
    url: 'https://69901694-e7db-4da1-909d-cd180476da2d.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
};

export default config;