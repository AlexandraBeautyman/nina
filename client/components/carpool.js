import React from 'react'
import {connect} from 'react-redux'
import {setOrigin, getBuddies, filterBuddies} from '../store/carpool'
import toastr from 'toastr'

class Carpool extends React.Component {
  constructor() {
    super()
    this.state = {
      email: '',
      definites: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.setState({
      definites: false
    })
  }

  async componentDidUpdate(prevProps) {
    function makeCoordinateBox(origin, event) {
      const coordinateBox = {}
      coordinateBox.top = origin.lat + Math.abs(origin.lat - event.lat)
      coordinateBox.bottom = origin.lat - Math.abs(origin.lat - event.lat)
      coordinateBox.left = origin.lng - Math.abs(origin.lng - event.lng)
      coordinateBox.right = origin.lng + Math.abs(origin.lng - event.lng)
      coordinateBox.width = coordinateBox.right - coordinateBox.left
      coordinateBox.depth = coordinateBox.top - coordinateBox.bottom
      return coordinateBox
    }
    if (this.props.potentials !== prevProps.potentials) {
      await this.props.winnowOptions(this.props.potentials, this.props.origin)
    }
    if (this.props.origin !== prevProps.origin) {
      const origin = this.props.origin
      const event = {lat: 40.104895, lng: -75.2295606}
      const addressInfo = makeCoordinateBox(origin, event)
      await this.props.submitAddressInfo(addressInfo, origin)
    }
    if (this.props.definites && this.props.definites !== prevProps.definites) {
      this.setState({
        definites: true,
        email: ''
      })
    }
    if (this.props.error && this.props.error !== prevProps.error) {
      this.setState({
        definites: true
      })
      toastr.options = {
        closeButton: true,
        showMethod: 'slideDown',
        timeOut: 3500,
        positionClass: 'toast-bottom-right'
      }
      toastr.error(
        'Sorry, we were unable to find anyone who would make you a good carpool buddy. :('
      )
    }
  }

  handleChange(event) {
    this.setState({
      email: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.submitOrigin(event.target.email.value)
    toastr.options = {
      closeButton: true,
      showMethod: 'slideDown',
      timeOut: 1000,
      positionClass: 'toast-bottom-right'
    }
    toastr.success(`Give us a moment to find you some options!`)
  }

  render() {
    return (
      <div className="carpool">
        <h3 className="carpool-text">
          Give us your email – we'll find you buddies!
        </h3>
        <form className="carpool-form" onSubmit={this.handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
        {this.state.definites && this.props.definites.length ? (
          <div className="buddies">
            {this.props.definites.map(definite => {
              return (
                <div className="buddies-content" key={definite.id}>
                  <div className="buddies-name-address">
                    <div className="buddies-name">
                      {definite.firstName + ' ' + definite.lastName}
                    </div>
                    <div className="buddies-address">
                      {definite.streetaddress}
                    </div>
                  </div>
                  <div className="buddies-email">{definite.email}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  potentials: state.carpool.buddies,
  definites: state.carpool.filteredBuddies,
  origin: state.carpool.origin,
  error: state.carpool.error
})

const mapDispatchToProps = dispatch => ({
  submitOrigin: function(originEmail) {
    dispatch(setOrigin(originEmail))
  },
  submitAddressInfo: function(coordinateBox, origin) {
    dispatch(getBuddies(coordinateBox, origin))
  },
  winnowOptions: function(buddies, origin) {
    dispatch(filterBuddies(buddies, origin))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Carpool)
