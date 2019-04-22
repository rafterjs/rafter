/**
 * @param {string} method
 * @param {string} endpoint
 * @param {Function} controller
 * @return {RouteDto}
 */
export default (method, endpoint, controller) => {
  /**
   * @namespace RouteDto
   */
  const RouteDto = {};

  /**
   * @return {string}
   */
  RouteDto.getEndpoint = () => {
    return endpoint;
  };

  /**
   * @return {Function}
   */
  RouteDto.getController = () => {
    return controller;
  };

  /**
   * @return {string}
   */
  RouteDto.getMethod = () => {
    return method;
  };

  return Object.freeze(RouteDto);
};
