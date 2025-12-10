/**
 * Gets the base URL of the application from the environment variables
 * Useful for handling asset loading in different environments (e.g., GitHub Pages)
 * @returns The base URL string
 */
export const getBaseUrl = () => {
  return import.meta.env.BASE_URL;
};
