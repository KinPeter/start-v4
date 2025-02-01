# StartV4

Personal dashboard application to manage some everyday things, built with all the newest features of Angular v19.

## Features:

- Access to notes, personal documents data and a collection of shortcuts in widgets or with search
- Weather information and location data
- Birthday calendar synced with Google Sheets
- Cycling and walking activity tracking synced with Strava
- Multi-language translator with DeepL API
- Full data backup service

## Technologies used:

- Angular v19 with Signals
- TypeScript
- Mobile friendly, custom CSS design
- Microfrontend architecture - Weather widget made in Vue 3
- ESLint, Prettier, Husky for code quality

## Development

### Prerequisites

- Node.js version >=22.5.1

Install the dependencies and also make sure the `@kinpeter/pk-common` package is up to date.

```bash
npm ci
npm run update:common
```

### Environment setup

Have a `.env` file in the root directory with the following content:

```bash
# URL of local API for development
PK_API_URL_DEV=

# URL of production API
PK_API_URL_PROD=
```

### Running the application

```bash
# Development configuration
npm run start

# Production configuration
npm run start:prod
```

### CI and deployment

After automated quality checks the application is deployed to FTP with GitHub Actions: `.github/workflows/cicd.yml`.

The deployment is triggered by pushing to the `main` branch.
