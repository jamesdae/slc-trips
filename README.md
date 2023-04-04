# slc-trips

A full stack JavaScript application for travelers who need help planning a trip to Salt Lake City, Utah.

## Why I Built This

I wanted to learn how to utilize Google Maps Platform APIs, and how to have users interact with a map and custom markers based on changes made on a database. As a frequent visitor of the area who often encourages others to visit, I used a personalized list of recommendations as the foundation of this trip planning application.

## Live Demo

Try the application live at [slctrips.com](https://slctrips.com)

## Technologies Used

### Front-end

- React.js
- Bootstrap 5
- Google Maps Platform APIs:
  - Google Maps JavaScript API: API for embedding Google Maps components
  - Google Places API: A web service for retrieving information about places with HTTP requests
  - Google Directions API: A web service for retrieving directions between multiple locations.

### Back-end

- Node.js (via 'express')
- PostgreSQL (via 'pg')
- JSON Web Tokens (via 'jsonwebtoken')

### Development Tools

- Babel
- Webpack


## Features

### Map and Places Features:

- View locations on an interactive map with markers
- Filter locations by category
- View Google Maps user reviews and photos for each location
- Pin favorite locations on a new map
- Create Google Maps Directions route between pinned locations
- Open routes or locations in Google Maps App or website

### Favorites and Routes Features:

- Add and remove locations from a favorites list
- Save created routes and render them on a map
- Rename and delete saved routes

### Account Features:

- Sign up for an account to access additional features
- Access the site as a guest with some limitations

## Preview

![Mobile view of place details](server/public/images/mobile%20info.gif)

![Desktop view of directions](server/public/images/desktop%20directions.gif)

## Stretch Features

- Pin current location on map to create new routes
- Search bar to include current location or existing places

## Development

### System Requirements

- Node.js 18.3 or higher
- PostgreSQL 14.3 or higher
- NPM 8.11 or higher

### Getting Started

1. Clone the repository.

    ```shell
    git clone https://github.com/jamesdae/final-project
    cd final-project
    ```

1. Install all dependencies with NPM.

    ```shell
    npm install
    ```

1. Start the PostgresQL service

    ```shell
    sudo service postgresql start
    ```

1. Set up the database

    ```shell
    npm run db:import
    ```

1. Start the project. Once started you can view the application by opening http://localhost:3000 in your browser.

    ```shell
    npm run dev
    ```
```
