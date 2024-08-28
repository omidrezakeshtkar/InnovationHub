# IdeaExchange Backend

## Development Setup

1. Clone the repository
2. Install dependencies: `yarn install`
3. Copy `.env.example` to `.env` and fill in the values
4. Start the development environment: `yarn dev`

## Email Testing

In the development environment, we use MailHog for email testing. MailHog captures all outgoing emails and provides a web interface to view them.

To access the MailHog web interface:

1. Start the development environment: `yarn dev`
2. Open your browser and go to `http://localhost:8025`

All emails sent by the application in development mode will be captured by MailHog and displayed in this interface.

## ...