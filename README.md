# 🎉 Positive Vibes Deployment Gate

[![Hackathon](https://img.shields.io/badge/GitHub-For%20the%20Love%20of%20Code%202025-blue)](https://github.blog/open-source/for-the-love-of-code-2025/)

> Block deployments if your team lacks positive emoji vibes! ✨

Ever had a grumpy deployment? This GitHub Action requires positive emojis in PR titles before allowing deployments. No more sad deploys!

## Quick Start

```yaml
- name: Check for positive vibes
  uses: codeanding/positive-vibes-gate@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Features

- **Scans merged PRs** for positive emojis
- **Blocks deployments** when team morale is low
- **Contributor leaderboard** shows who spreads the most joy
- **Configurable** emoji list and requirements

## Usage

```yaml
name: Deployment with Positive Vibes
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check positive vibes
        uses: codeanding/positive-vibes-gate@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          days-lookback: 7
          require-count: 1

      - name: Deploy
        run: echo "🎉 Deploying with good vibes!"
```

## Configuration

| Input             | Description                         | Default                   |
| ----------------- | ----------------------------------- | ------------------------- |
| `github-token`    | GitHub token for API access         | `${{ github.token }}`     |
| `days-lookback`   | Days to look back for merged PRs    | `7`                       |
| `require-count`   | Minimum positive emoji PRs required | `1`                       |
| `positive-emojis` | Custom emoji list (comma-separated) | `😊,🎉,✨,🚀,💫,🌟,🔥,💯` |

## Example PR Titles That Work

- `🚀 Add user authentication`
- `✨ Fix critical bug`
- `🎉 Update documentation`
- `💯 Refactor API endpoints`

## Troubleshooting

**Deployment blocked?** Create a PR with positive emojis:

```bash
git commit -m "✨ Add positive vibes to unlock deployment"
```

## Contributing

Built for **GitHub For the Love of Code 2025** hackathon! PRs welcome (especially with positive titles 😉)

## License

MIT License - spread the positive vibes! 🌟

---

**Made with ❤️ for the GitHub For the Love of Code 2025 hackathon**

_Keep spreading those positive vibes!_ ✨🎉🚀
