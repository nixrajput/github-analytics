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
  - [GitHub App setup](#github-app-setup)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)
  - [Support My Work](#support-my-work)
  - [Connect With Me](#connect-with-me)

## Features

- Sign in with GitHub. Every request to GitHub uses the visitor's own token.
- View your GitHub profile information.
- Display your repositories, commits, pull requests, and issues.
- Filter repositories by type (public, private, forked, archived).
- Sort repositories by name, stars, forks, and updated date.
- Search repositories by name.
- View detailed information about each repository.
- Responsive design for mobile, tablet, and desktop devices.
- Dark mode support for reduced eye strain.
- Easy customization of content and images.
- Simple deployment to Vercel, Netlify or any host that runs a Next.js server.
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

- Create a GitHub App first (see [GitHub App setup](#github-app-setup)). Then create a `.env.local` file in the project root with these variables:

   ```env
   AUTH_SECRET=your-random-secret
   AUTH_GITHUB_ID=your-github-app-client-id
   AUTH_GITHUB_SECRET=your-github-app-client-secret
   NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
   ```

   - `AUTH_SECRET` encrypts the session cookie. Generate one with `openssl rand -base64 33`.
   - `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` are the GitHub App's client ID and client secret.
   - `NEXT_PUBLIC_GITHUB_USERNAME` is optional. It sets the username that the dashboard shows first.

   Every page except `/sign-in` requires a GitHub sign-in, and `/api/github` answers 401 without one. The visitor's GitHub tokens stay inside the encrypted, HttpOnly session cookie. The browser never receives them, and `/api/auth/session` does not return them. Never give the three `AUTH_` variables a `NEXT_PUBLIC_` prefix: Next.js copies every `NEXT_PUBLIC_` variable into the JavaScript that it sends to the browser.

   If you host the app somewhere other than Vercel, also set `AUTH_TRUST_HOST=true` or `AUTH_URL=https://your-domain`.

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

## GitHub App setup

The dashboard signs visitors in through a GitHub App that has no permissions. It only reads public data, with each visitor's own user token.

1. Open GitHub **Settings**, then **Developer settings**, then **GitHub Apps**, and click **New GitHub App**.
2. Enter a name and set **Homepage URL** to `https://github-analytics-dashboard.vercel.app`.
3. Add both **Callback URLs**:
   - `https://github-analytics-dashboard.vercel.app/api/auth/callback/github`
   - `http://localhost:3000/api/auth/callback/github`
4. Turn on **Expire user authorization tokens**. The app refreshes the 8-hour tokens itself.
5. Leave **Request user authorization (OAuth) during installation** off.
6. Under **Webhook**, clear **Active**.
7. Do not add any permissions. Keep only the default metadata read access, so the App reads public data only.
8. Under **Where can this GitHub App be installed?**, choose **Any account**. Visitors only authorize the App when they sign in. Nobody needs to install it. GitHub lets only the owner authorize an App set to **Only on this account**, so with that setting nobody else can sign in.
9. Click **Create GitHub App**. Copy the **Client ID** into `AUTH_GITHUB_ID`.
10. Click **Generate a new client secret** and copy it into `AUTH_GITHUB_SECRET`. GitHub shows it only once.

## Deployment

To deploy the dashboard to a hosting service of your choice, follow the deployment instructions for Next.js applications. The dashboard calls GitHub through its own API route, so it needs a host that runs a Next.js server, such as Vercel or Netlify. Static hosts such as GitHub Pages do not work.

On Vercel, open the project's **Settings**, then **Environment Variables**. Add `AUTH_SECRET`, `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` for **Production**, then redeploy. Remove `GITHUB_TOKEN` and `NEXT_PUBLIC_GITHUB_TOKEN` if they are still set.

Preview deployments cannot complete the sign-in unless the preview URL's callback (`https://<preview-host>/api/auth/callback/github`) is added to the GitHub App's callback URLs and the three variables are set for **Preview** too. GitHub allows up to 10 callback URLs per App.

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
