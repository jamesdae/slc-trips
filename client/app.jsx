import React from 'react';
import Home from './pages/home';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: null
    };
  }

  componentDidMount() {
    fetch('/api/locations')
      .then(res => res.json())
      .then(locations => {
        // eslint-disable-next-line no-console
        console.log('App mounted and here are fetched locations: ', locations);
        this.setState({ locations });
      })
      .catch(err => console.error('Error:', err));
    /**
     * Use fetch to send a GET request to `/api/locations`.
     * Then 😉, once the response JSON is received and parsed,
     * update state with the received locations.
     */
  }

  render() {
    if (this.state.locations) {
      return <Home all={this.state.locations} />; // if state locations array is defined, use index 1 locations
    } else {
      return null;
    }
  }
}
