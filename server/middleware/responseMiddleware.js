export default (req, res, next) => {
  /**
   * Error Handler
   *
   * Usage:
   * return res.error(status, error);
   *
   * e.g.:
   * ```
   * return res.error( '400', 'Please choose a valid `password`' );
   * ```
   */
  res.error = function (status, error) {
    this.status(status).json({
      status,
      error,
    });
  };

  /**
   * Success Handler
   *
   * Usage:
   * return res.success(status, data);
   *
   * e.g.:
   * ```
   * return res.success( '200', 'User created' );
   * ```
   */
  res.success = function (status, data) {
    this.status(status).json({
      status,
      data,
    });
  };

  next();
};
