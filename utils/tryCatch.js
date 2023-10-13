/**
 * 
 * @param {middleware function} controller 
 *
 * this function is made to catch errors and not re-write it every time you create a route 
 */

module.exports = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next)
  } catch (error) {
    next(error)
  }
}