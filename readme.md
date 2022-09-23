# URL Shortener

URL Shortening app made in Express. Also serves a webpage consuming the API as example

This app was made only as a learning exercise, to see if I could develop the project in a single afternoon. I've since cleaned it up, but the main code is untouched

## Endpoints

### GET /

Serves the example webpage. It's a simple form that sends a POST request to the API, and displays the shortened URL


### POST /create

Creates a shortened URL. It expects a JSON body with the following structure:

    {
      "url": "https://google.com"
    }

It returns a JSON response with the following structure:

    {
      "url": "https://url-shortener-domain.com/s/:shortened"
    }

### GET /s/:shortened

Redirects to the original URL, if it exists. Otherwise, it returns a 404

## Backlog

- [x] Create Express API
- [x] Create frontend
- [x] Choose between SQL and SQLite
- [x] Deployment script
- [ ] Migrate frontend to Angular
- [ ] Deploy to Vercel
- [ ] Setup tests via GitHub actions
