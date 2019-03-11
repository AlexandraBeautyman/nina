import React from 'react'
import {connect} from 'react-redux'
import {addGuest} from '../store/input'
import toastr from 'toastr'

class Input extends React.Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      address: ''
    }
    this.handleAddressSubmit = this.handleAddressSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.error && this.props.error !== prevProps.error) {
      toastr.options = {
        closeButton: true,
        showMethod: 'slideDown',
        timeOut: 2500,
        positionClass: 'toast-bottom-right'
      }
      toastr.warning(
        'Your email is already in the database. If you need to change your info, contact Lex!'
      )
    } else if (this.props.guest !== prevProps.guest) {
      toastr.success(`You have submitted your address!`)
      this.setState({
        firstName: '',
        lastName: '',
        email: '',
        address: ''
      })
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleAddressSubmit(event) {
    event.preventDefault()
    const eventLocation = {
      streetaddress: '6012 Cricket Road, Flourtown, PA 19031',
      lat: 40.104895,
      lng: -75.2295606
    }
    const guestInfo = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: event.target.email.value,
      address: event.target.address.value
    }
    this.props.submitGuest(guestInfo, eventLocation)
    toastr.options = {
      closeButton: true,
      showMethod: 'slideDown',
      timeOut: 2000,
      positionClass: 'toast-bottom-right'
    }
  }

  render() {
    return (
      <div className="input-form-div">
        <h3 className="input-text"> Let us know where you're coming from!</h3>
        <form className="input-form" onSubmit={this.handleAddressSubmit}>
          <label htmlFor="firstName">First name</label>
          <input
            name="firstName"
            type="text"
            value={this.state.firstName}
            onChange={this.handleChange}
            required
          />

          <label htmlFor="lastName">Last name</label>
          <input
            name="lastName"
            type="text"
            value={this.state.lastName}
            onChange={this.handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            required
          />

          <label htmlFor="address">Address</label>
          <input
            name="address"
            type="text"
            value={this.state.address}
            onChange={this.handleChange}
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  guest: state.input.guest,
  eventDeets: state.input.eventDeets,
  error: state.input.error
})

const mapDispatchToProps = dispatch => ({
  submitGuest: (guestInfo, eventLocation) =>
    dispatch(addGuest(guestInfo, eventLocation))
})

export default connect(mapStateToProps, mapDispatchToProps)(Input)
