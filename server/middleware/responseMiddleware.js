export default (req, res, next) => {
  /**
   * @description API response for Error e.g. 400, 404
   * @param{int} status
   * @param {object} error
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
   * @description API response for Success e.g. 200, 201
   * @param{int} status
   * @param {object} data
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
