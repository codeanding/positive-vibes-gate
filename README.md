# 🎉 Positive Vibes Deployment Gate

[![Hackathon](https://img.shields.io/badge/GitHub-For%20the%20Love%20of%20Code%202025-blue)](https://github.blog/open-source/for-the-love-of-code-2025/)

> Block deployments if your team lacks positive emoji vibes! ✨

Ever had a grumpy deployment? This GitHub Action requires positive emojis in PR titles before allowing deployments. No more sad deploys!

## Quick Start

**Deployment Gate Mode**:

```yaml
- name: Check team positive vibes before deploy
  uses: codeanding/positive-vibes-gate@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    mode: deployment
```

**PR Validation Mode**:

```yaml
- name: Validate PR title has positive vibes
  uses: codeanding/positive-vibes-gate@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    mode: pr
```

**Last Merge Mode**:

```yaml
- name: Check last merged PR vibes
  uses: codeanding/positive-vibes-gate@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    mode: last-merge
```

## 📸 Demo in Action

### ❌ Deployment Blocked - No Positive Vibes
<img width="800" alt="Deployment Failed" src="https://github.com/user-attachments/assets/75645ed7-ecdc-4c21-983a-a0df0907d42c" />

### ✅ Deployment Approved - Positive Vibes Found
<img width="800" alt="Deployment Success" src="https://github.com/user-attachments/assets/0daae778-3b5c-4b4b-801f-efe55ef503a7" />

## Features

- **Triple modes**: Deployment gate (team scanning), PR validation, or last-merge validation
- **Scans merged PRs** for positive emojis (deployment mode)
- **Validates PR titles** in real-time (PR mode)
- **Validates last merged PR** specifically (last-merge mode)
- **Blocks deployments/PRs** when vibes are low
- **Contributor leaderboard** shows who spreads the most joy
- **Configurable** emoji list and requirements

## Usage Examples

**Deployment Gate Mode** - Block deployments if team lacks positive vibes:

```yaml
name: Deployment with Positive Vibes Gate
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check team positive vibes
        uses: codeanding/positive-vibes-gate@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          mode: deployment
          days-lookback: 7
          require-count: 1

      - name: Deploy
        run: echo "🎉 Deploying with good vibes!"
```

**PR Validation Mode** - Block PRs without positive titles:

```yaml
name: PR Positive Vibes Check
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  check-pr-vibes:
    runs-on: ubuntu-latest
    steps:
      - name: Check PR title vibes
        uses: codeanding/positive-vibes-gate@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          mode: pr
```

## Configuration

| Input             | Description                                           | Default                   |
| ----------------- | ----------------------------------------------------- | ------------------------- |
| `github-token`    | GitHub token for API access                           | `${{ github.token }}`     |
| `mode`            | Validation mode: `deployment`, `pr`, or `last-merge`  | `deployment`              |
| `days-lookback`   | Days to look back for merged PRs (deployment mode)    | `7`                       |
| `require-count`   | Minimum positive emoji PRs required (deployment mode) | `1`                       |
| `positive-emojis` | Custom emoji list (comma-separated)                   | `😊,🎉,✨,🚀,💫,🌟,🔥,💯` |

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
