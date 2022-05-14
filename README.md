# TerminHTML Bootstrap

<div align="center">
  <p align="center">
    <a href="https://nickderobertis.github.io/terminhtml/">
      <img src="https://nickderobertis.github.io/terminhtml/_static/images/demo-output.gif" alt="TerminHTML example GIF">
    </a>
  </p>
  <sub>This GIF doesn't do TerminHTML justice, check out the full version in <a href="https://codepen.io/nickderobertis/pen/mdXOGJd">a CodePen example</a></sub>
</div>
<br>

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

Automatically initialize TerminHTML terminals when elements come into view

## Basic Usage

First, set up your HTML to something that can be rendered with
[TerminHTML JS](https://github.com/nickderobertis/terminhtml-js). To make it work
by default with the bootstrap script, just add the class `terminhtml`. For example:

```html
<pre class="terminhtml">
$ echo woo
woo
</pre>
```

Then also add the bootstrap script to your HTML:

```html
<head>
  <script src="https://unpkg.com/@terminhtml/bootstrap@1.x/dist/@terminhtml-bootstrap.umd.js"></script>
</head>
```

This will automatically set up TerminHTML for any blocks with class `terminhtml`, and initialize them
once they come into view.

See [this example on CodePen](https://codepen.io/nickderobertis/pen/YzepOpK).

## Install

You can simply add the script tag to your page as shown in the above example. If you want to
customize the bootstrap behavior, you can use the NPM package:

```bash
npm install @terminhtml/bootstrap
```

## Usage

See the above example for basic usage. You can also import the bootstrap function directly to pass other options:

```ts
import { bootstrapTerminHTMLs } from "@terminhtml/bootstrap/dist/src/bootstrap";

bootstrapTerminHTMLs({ class: "my-terminhtml" });
```

## Development Status

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for versioning.
Any time the major version changes, there may be breaking changes. If it is working well for you, consider
pegging to the current major version, e.g. `@terminhtml/bootstrap@v1`, to avoid breaking changes. Alternatively,
you can always point to the most recent stable release with the `@terminhtml/bootstrap@latest`.

## Developing

Clone the repo and then run `npm install` to set up the pre-commit hooks.

Run `npm run dev` to start the development server, and `npm run build` to create a production build
of the library.

The library files are stored in `src`, while the files for the development page are in `dev-src`.

## Author

Created by Nick DeRobertis. MIT License.

[build-img]: https://github.com/nickderobertis/terminhtml-bootstrap/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/nickderobertis/terminhtml-bootstrap/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/@terminhtml/bootstrap
[downloads-url]: https://www.npmtrends.com/@terminhtml/bootstrap
[npm-img]: https://img.shields.io/npm/v/@terminhtml/bootstrap
[npm-url]: https://www.npmjs.com/package/@terminhtml/bootstrap
[issues-img]: https://img.shields.io/github/issues/nickderobertis/terminhtml-bootstrap
[issues-url]: https://github.com/nickderobertis/terminhtml-bootstrap/issues
[codecov-img]: https://codecov.io/gh/nickderobertis/terminhtml-bootstrap/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/nickderobertis/terminhtml-bootstrap
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
