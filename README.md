# Wordly

Wordly is a simple interactive dictionary web app that looks up English words using the Dictionary API and displays definitions, pronunciations, synonyms, antonyms, and audio pronunciation playback.

## Features

- Search for English words using a clean search form
- Display word definitions grouped by part of speech
- Show pronunciation text from the dictionary API
- Play pronunciation audio when available
- Display synonyms and antonyms if returned by the API
- Responsive layout for mobile and desktop
- Clear results with a dedicated button

## Project Structure

- `index.html` — main page layout and search form
- `style.css` — styles for layout, cards, buttons, and responsive design
- `script.js` — app logic for fetching API data, rendering results, and audio playback

## API

This project uses the free Dictionary API:

- `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`

The app expects JSON responses in the format returned by the API, including `word`, `phonetic`, `phonetics`, and `meanings`.

## Getting Started

### Option 1: Open locally

1. Open `index.html` directly in your browser.
2. Enter a word in the search field.
3. Click `Search` to load the result.
4. Click the speaker icon (if present) to play pronunciation audio.

### Option 2: Serve with a local HTTP server

For best behavior and to avoid browser restrictions, serve the app from a local HTTP server.


## How it works

- User submits the search form.
- `script.js` fetches data from the dictionary API.
- Results are rendered into card elements inside `#results-container`.
- The app uses helper functions to format synonyms/antonyms and handle errors.
- If audio is available, a speaker button appears and plays the pronunciation when clicked.

