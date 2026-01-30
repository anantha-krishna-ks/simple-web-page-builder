interface AppConfig {
  VITE_API_BASE_URL: string;
  VITE_ADMIN_URL: string;
}

let config: AppConfig | null = null;

export const loadConfig = async (): Promise<AppConfig> => {
  if (config) {
    return config;
  }

  try {
    const response = await fetch('/oxfordignite/config.json');
    if (!response.ok) {
      throw new Error('Failed to load configuration');
    }
    config = await response.json();
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    // Fallback to environment variables
    config = {
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL ,
      VITE_ADMIN_URL: import.meta.env.VITE_ADMIN_URL 
    };
    return config;
  }
};

export const getConfig = (): AppConfig => {
  if (!config) {
    throw new Error('Configuration not loaded. Call loadConfig() first.');
  }
  return config;
};

export const getApiBaseUrl = async (): Promise<string> => {
  const config = await loadConfig();
  return config.VITE_API_BASE_URL;
};

export const getApiBaseUrlSync = (): string => {
  // If config is loaded, use it; otherwise fallback to environment variable
  if (config) {
    return config.VITE_API_BASE_URL;
  }
  // Fallback to environment variable
  return import.meta.env.VITE_API_BASE_URL;
};

export const getAdminUrl = async (): Promise<string> => {
  const config = await loadConfig();
  return config.VITE_ADMIN_URL;
};