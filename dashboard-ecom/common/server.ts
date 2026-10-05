/**
 * ALL COMMON SERVER UTILITIES IN THE APP
 */

export const logMiddleware = (message: { message?: string }) => {
  const PREFIX = "MIDDLEWARE_LOGGER";
  const MESSAGE = "Middleware";
  console.log(PREFIX, " - ", message || MESSAGE);
};
