import PropTypes from 'prop-types'

export const nameShape = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    enter: PropTypes.string,
    leave: PropTypes.string,
    active: PropTypes.string,
    height: PropTypes.string,
  }),
  PropTypes.shape({
    enter: PropTypes.string,
    enterActive: PropTypes.string,
    leave: PropTypes.string,
    leaveActive: PropTypes.string,
    appear: PropTypes.string,
    appearActive: PropTypes.string,
    height: PropTypes.string,
    heightActive: PropTypes.string,
  }),
])
