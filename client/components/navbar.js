import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import Carpool from './carpool'
import Input from './input-address'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div className="header">
    <div className="logo">
      <img
        className="logo-image"
        src="./nina_dance_edited.png"
        width="150px"
        height="150px"
      />
      <h1 className="logo-text">Nina</h1>
    </div>
    <div className="links">
      <Link to="/input" className="input-link">
        Add your address{' '}
      </Link>
      <Link to="/carpool" className="carpool-link">
        Find carpool buddies
      </Link>
    </div>
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
