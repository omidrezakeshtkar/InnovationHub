# InnovationHub

## Overview

InnovationHub is a platform designed to foster innovation and collaboration within organizations. It allows team members to share ideas, vote, comment, and track engagement through a user-friendly interface.

## Development Setup

To set up the development environment for InnovationHub, follow these steps:

1. **Clone the Repository**: Clone the project repository to your local machine.
2. **Install Dependencies**: Run `yarn install` to install all necessary dependencies.
3. **Environment Configuration**: Copy `.env.example` to `.env` and fill in the required configuration values.
4. **Start Development Server**: Use `yarn dev` to start the development server.

## Email Testing

InnovationHub uses MailHog for email testing in the development environment. MailHog captures all outgoing emails and provides a web interface to view them.

### Accessing MailHog

1. **Start the Development Environment**: Ensure the development server is running with `yarn dev`.
2. **Open MailHog Interface**: Go to `http://localhost:8025` in your web browser.

All emails sent by the application in development mode will be captured by MailHog and displayed in this interface.

## Contribution

We welcome contributions to InnovationHub. Please follow the standard GitHub flow for contributing:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push your branch.
4. Open a pull request for review.

## License

InnovationHub is open-source software licensed under the MIT License. See the `LICENSE` file for more information.