# GitHub Analytics Dashboard

GitHub Analytics Dashboard is a web application that provides insights into your GitHub profile. It displays information about your repositories, commits, pull requests, issues, and more. The dashboard is built using Next.js, Tailwind CSS, and the GitHub API.

[![Stars](https://img.shields.io/github/stars/nixrajput/github-analytics?label=Stars&style=flat)][repo]
[![Forks](https://img.shields.io/github/forks/nixrajput/github-analytics?label=Forks&style=flat)][repo]
[![Watchers](https://img.shields.io/github/watchers/nixrajput/github-analytics?label=Watchers&style=flat)][repo]
[![Contributors](https://img.shields.io/github/contributors/nixrajput/github-analytics?label=Contributors&style=flat)][repo]

[![GitHub last commit](https://img.shields.io/github/last-commit/nixrajput/github-analytics?label=Last+Commit&style=flat)][repo]
[![GitHub issues](https://img.shields.io/github/issues/nixrajput/github-analytics?label=Issues&style=flat)][issues]
[![GitHub pull requests](https://img.shields.io/github/issues-pr/nixrajput/github-analytics?label=Pull+Requests&style=flat)][pulls]
[![GitHub License](https://img.shields.io/github/license/nixrajput/github-analytics?label=License&style=flat)][license]

[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/nixrajput/github-analytics?label=Code+Size&style=flat)][repo]
[![GitHub repo size](https://img.shields.io/github/repo-size/nixrajput/github-analytics?label=Repo+Size&style=flat)][repo]
[![GitHub language count](https://img.shields.io/github/languages/count/nixrajput/github-analytics?label=Languages&style=flat)][repo]

[![GitHub top language](https://img.shields.io/github/languages/top/nixrajput/github-analytics?label=Top+Language&style=flat)][repo]
[![GitHub license](https://img.shields.io/github/license/nixrajput/github-analytics?label=License&style=flat)][license]
[![GitHub contributors](https://img.shields.io/github/contributors/nixrajput/github-analytics?label=Contributors&style=flat)][repo]

[![GitHub issues](https://img.shields.io/github/issues/nixrajput/github-analytics?label=Issues&style=flat)][issues]
[![GitHub pull requests](https://img.shields.io/github/issues-pr/nixrajput/github-analytics?label=Pull+Requests&style=flat)][pulls]
[![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/nixrajput/github-analytics?label=Closed+Pull+Requests&style=flat)][pulls]

## Table of Contents

- [GitHub Analytics Dashboard](#github-analytics-dashboard)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)
  - [Support My Work](#support-my-work)
  - [Connect With Me](#connect-with-me)

## Features

- View your GitHub profile information.
- Display your repositories, commits, pull requests, and issues.
- Filter repositories by type (public, private, forked, archived).
- Sort repositories by name, stars, forks, and updated date.
- Search repositories by name.
- View detailed information about each repository.
- Responsive design for mobile, tablet, and desktop devices.
- Dark mode support for reduced eye strain.
- Easy customization of content and images.
- Simple deployment to hosting services like Vercel, Netlify, and GitHub Pages.
- Open-source license for personal and commercial use.
- Regular updates and new features.

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

You need to have the following software installed on your computer:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/), [pnpm](https://pnpm.io/), [Yarn](https://yarnpkg.com/) or [Bun](https://bun.sh) package manager

### Installation

1. Star the repository.

2. Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/nixrajput/github-analytics.git
   ```

3. Navigate to the project directory:

   ```bash
   cd github-analytics
   ```

4. Install the project dependencies:

   If you're using npm:

   ```bash
   npm install
   ```

   If you're using pnpm:

   ```bash
   pnpm install
   ```

   If you're using Yarn:

   ```bash
   yarn install
   ```

   If you're using Bun:

   ```bash
   bun install
   ```

## Usage

- Create a `.env.local` file in the root directory of the project and add the following environment variables:

   ```env
   NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
   NEXT_PUBLIC_GITHUB_TOKEN=your-github-access-token
   NEXT_PUBLIC_EMAIL_USERNAME=your-email-username
   NEXT_PUBLIC_EMAIL_PASSWORD=your-email-password
   NEXT_PUBLIC_EMAIL_HOST=your-email-host
   NEXT_PUBLIC_EMAIL_PORT=your-email-port
   NEXT_PUBLIC_EMAIL_SECURE=your-email-secure
   NEXT_PUBLIC_EMAIL_FROM=your-email-from
   NEXT_PUBLIC_EMAIL_TO=your-email-to
   ```

   Replace the placeholder values with your GitHub username, GitHub access token, email credentials, and email addresses. You can create a GitHub access token by following the instructions in the [GitHub documentation](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

- To start the development server and view the website locally, run the following command:

   ```bash
   npm run dev
   #or
   pnpm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

   This will start the Next.js development server, and you can access the website in your web browser at `http://localhost:3000`.

## Deployment

To deploy the portfolio website to a hosting service of your choice, follow the deployment instructions for Next.js applications. Some popular hosting options include Vercel, Netlify, and GitHub Pages.

Remember to configure environment variables for sensitive information like email credentials if needed.

## Contributing

If you would like to contribute to this project, feel free to fork the repository, make your changes, and submit a pull request. Please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support My Work

Your support helps me dedicate more time to developing high-quality, impactful projects in the open-source community. Sponsor me, and together, let’s bring even more innovation to life!

[![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/nixrajput)

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/nixrajput)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/nixrajput)

## Connect With Me

[![GitHub: nixrajput](https://img.shields.io/badge/nixrajput-EFF7F6?logo=GitHub&logoColor=333&link=https://www.github.com/nixrajput)][github]
[![Linkedin: nixrajput](https://img.shields.io/badge/nixrajput-EFF7F6?logo=LinkedIn&logoColor=blue&link=https://www.linkedin.com/in/nixrajput)][linkedin]
[![Instagram: nixrajput](https://img.shields.io/badge/nixrajput-EFF7F6?logo=Instagram&link=https://www.instagram.com/nixrajput)][instagram]
[![Twitter: nixrajput07](https://img.shields.io/badge/nixrajput-EFF7F6?logo=X&logoColor=333&link=https://x.com/nixrajput)][twitter]
[![Telegram: nixrajput](https://img.shields.io/badge/nixrajput-EFF7F6?logo=Telegram&link=https://telegram.me/nixrajput)][telegram]
[![Gmail: nkr.nikhi.nkr@gmail.com](https://img.shields.io/badge/nkr.nikhil.nkr@gmail.com-EFF7F6?logo=Gmail&link=mailto:nkr.nikhil.nkr@gmail.com)][gmail]

[github]: https://github.com/nixrajput
[twitter]: https://twitter.com/nixrajput07
[instagram]: https://instagram.com/nixrajput
[linkedin]: https://linkedin.com/in/nixrajput
[telegram]: https://telegram.me/nixrajput
[gmail]: mailto:nkr.nikhil.nkr@gmail.com
[repo]: https://github.com/nixrajput/github-analytics
[issues]: https://github.com/nixrajput/github-analytics/issues
[pulls]: https://github.com/nixrajput/github-analytics/pulls
[license]: https://github.com/nixrajput/github-analytics/blob/master/LICENSE.md
