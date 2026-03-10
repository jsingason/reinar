# RÚV Orðabók – m.is

A browser extension that enhances the word-learning player on [ord.ruv.is](https://ord.ruv.is). When a word appears in the player, the extension automatically looks it up via the [malid.is](https://malid.is) API and injects a direct link to its entry in the [m.is Icelandic dictionary](https://m.is/ordabok), so you can read a full definition without leaving the page.

Built with [Plasmo](https://docs.plasmo.com/).

## Development

```bash
pnpm dev
```

Load `build/chrome-mv3-dev` as an unpacked extension in Chrome, then open the [RÚV player](https://ord.ruv.is/player/) to see it in action.
