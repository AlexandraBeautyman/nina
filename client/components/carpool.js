import React from 'react'
import {connect} from 'react-redux'
import {setOrigin, getBuddies, filterBuddies} from '../store/carpool'

class Carpool extends React.Component {
  constructor() {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
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
  }

  async handleSubmit(event) {
    event.preventDefault()
    await this.props.submitOrigin(event.target.address.value)
  }

  render() {
    return (
      <div>
        <h1>Find your carpool buddies!</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="address">Address</label>
          <input name="address" type="text" />
          <button type="submit">Submit</button>
        </form>
        {this.props.definites && this.props.definites.length ? (
          <div>
            <h3>Suggested Carpool Buddies:</h3>
            {this.props.definites.map(definite => {
              return <p key={definite.id}>{definite.streetaddress}</p>
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
  origin: state.carpool.origin
})

const mapDispatchToProps = dispatch => ({
  submitOrigin: function(originAddress) {
    dispatch(setOrigin(originAddress))
  },
  submitAddressInfo: function(coordinateBox, origin) {
    dispatch(getBuddies(coordinateBox, origin))
  },
  winnowOptions: function(buddies, origin) {
    dispatch(filterBuddies(buddies, origin))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Carpool)
