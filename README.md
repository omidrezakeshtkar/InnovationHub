# InnovationHub

## Overview

InnovationHub is a platform designed to foster innovation and collaboration within organizations. It allows team members to share ideas, vote, comment, and track engagement through a user-friendly interface.

## Development Setup

To set up the development environment for InnovationHub, follow these steps:

1. **Clone the Repository**: Clone the project repository to your local machine.
2. **Install Dependencies**: Run `yarn install` to install all necessary dependencies for both frontend and backend.
3. **Environment Configuration**: Copy `.env.example` to `.env` in the backend directory and fill in the required configuration values.
4. **Start Development Server**: Use `docker compose -f docker-compose.dev.yml up` to start the development environment, which includes the backend, MongoDB, Redis, MinIO, and MailHog services. The backend service will automatically run `yarn predev` followed by `yarn dev`. Alternatively, you can manually run `yarn predev` to start the backend services.
5. **Frontend Development**: To run the frontend, navigate to the `frontend` directory and use the scripts defined in `package.json`. You can start the development server with `yarn dev`, build the project with `yarn build`, and preview the build with `yarn preview`.

## Email Testing

InnovationHub uses MailHog for email testing in the development environment. MailHog captures all outgoing emails and provides a web interface to view them.

### Accessing MailHog

1. **Start the Development Environment**: Ensure the development environment is running with `docker compose -f docker-compose.dev.yml up`.
2. **Open MailHog Interface**: Go to `http://localhost:8025` in your web browser.

All emails sent by the application in development mode will be captured by MailHog and displayed in this interface.

## Contribution

We welcome contributions to InnovationHub. Please follow the standard GitHub flow for contributing:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push your branch.
4. Open a pull request for review.

## AI Assistance Acknowledgement

This project has been significantly developed with the assistance of Large Language Models (LLMs). We want to acknowledge the substantial contributions of:

- An advanced language model developed by OpenAI
- An advanced language model developed by Anthropic
- An AI-enhanced code editor, specifically [Cursor](https://cursor.com), utilizing its feature Composer

These tools have been instrumental in generating code, solving problems, and enhancing the development process. Our use of these technologies is for educational and developmental purposes, and does not imply any official endorsement or affiliation.

We are committed to the ethical use of AI in development. If any concerns arise regarding our acknowledgements, we are open to addressing them promptly.

I refrained from directly naming the specific language models due to concerns about violating policies, so I only mentioned the companies. However, if it is clearly stated in these companies' licenses that using model names in open source projects is not against the rules, I will include the specific models used in this project. Nonetheless, by mentioning the companies, I am confident that readers can infer which models were used.

## AI Assistance Details

The AI models were utilized in different capacities throughout the project:

- OpenAI's model was primarily used for analysis, comprehension, and initial project understanding. For instance, in Cursor IDE's Composer (prior to the 0.42 update), I would use prompts like "tell me about this project" along with "@backend" or "@frontend" to reference specific folders, providing the AI with project context. This approach was particularly useful for initial analysis and interpreting OpenAI model outputs.

- Anthropic's model was the primary tool for code generation. After the initial project analysis, I predominantly used this model for coding tasks.

- In scenarios requiring deeper analysis or more detailed explanations, I would switch back to OpenAI's model.

This combination allowed me to leverage the strengths of each model: OpenAI for broader understanding and analysis, and Anthropic for more focused code generation tasks.

## License

InnovationHub is open-source software licensed under the MIT License. See the `LICENSE` file for more information.
