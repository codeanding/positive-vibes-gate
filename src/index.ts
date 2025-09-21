import * as core from '@actions/core';
import * as github from '@actions/github';
import { GitHubAPI } from './github-api';
import { parsePositiveEmojis, hasPositiveEmoji, countPositiveEmojis } from './emojis';
import type { PositivePR, ContributorStatsMap } from './types';

export async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', { required: true });
    const daysLookback = parseInt(core.getInput('days-lookback') || '7', 10);
    const requireCount = parseInt(core.getInput('require-count') || '1', 10);
    const positiveEmojisInput = core.getInput('positive-emojis');

    const positiveEmojis = parsePositiveEmojis(positiveEmojisInput);
    const { owner, repo } = github.context.repo;

    core.info(`🔍 Scanning ${owner}/${repo} for positive vibes in the last ${daysLookback} days...`);
    core.info(`✨ Looking for these emojis: ${positiveEmojis.join(' ')}`);

    const api = new GitHubAPI(token);

    const mergedPRs = await api.getMergedPRs(owner, repo, daysLookback);
    core.info(`📊 Found ${mergedPRs.length} merged PRs in the last ${daysLookback} days`);

    const positivePRs: PositivePR[] = [];
    const contributorStats: ContributorStatsMap = {};

    for (const pr of mergedPRs) {
      const prData = api.extractPRData(pr);

      if (hasPositiveEmoji(prData.title, positiveEmojis)) {
        const emojiCount = countPositiveEmojis(prData.title, positiveEmojis);

        positivePRs.push({
          ...prData,
          emojiCount
        });

        if (!contributorStats[prData.user]) {
          contributorStats[prData.user] = {
            username: prData.user,
            positivePRs: 0,
            totalEmojis: 0,
            prs: []
          };
        }

        contributorStats[prData.user].positivePRs++;
        contributorStats[prData.user].totalEmojis += emojiCount;
        contributorStats[prData.user].prs.push({
          number: prData.number,
          title: prData.title,
          url: prData.htmlUrl,
          emojiCount
        });
      }
    }

    const totalPositivePRs = positivePRs.length;
    const positiveVibesFound = totalPositivePRs >= requireCount;

    let message: string;
    if (positiveVibesFound) {
      message = `✅ POSITIVE VIBES DETECTED! 🎉\nFound ${totalPositivePRs} positive emoji PRs in the last ${daysLookback} days.\nYour team is spreading the joy! ✨`;
      core.info(message);
    } else {
      message = `❌ DEPLOYMENT BLOCKED! 🚫\nYour team needs more ✨ in their lives!\nFound ${totalPositivePRs} positive emoji PRs in the last ${daysLookback} days (need ${requireCount}).\nAdd some joy to your PR titles: ${positiveEmojis.slice(0, 10).join(' ')}`;
      core.setFailed(message);
    }

    if (positivePRs.length > 0) {
      core.info('\n🌟 Positive PRs found:');
      positivePRs.forEach(pr => {
        core.info(`  • #${pr.number} by @${pr.user}: ${pr.title}`);
      });
    }

    if (Object.keys(contributorStats).length > 0) {
      core.info('\n📈 Positive Vibes Leaderboard:');
      const sortedContributors = Object.values(contributorStats)
        .sort((a, b) => b.totalEmojis - a.totalEmojis);

      sortedContributors.forEach((contributor, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏆';
        core.info(`  ${medal} @${contributor.username}: ${contributor.positivePRs} PRs, ${contributor.totalEmojis} emojis`);
      });
    }

    core.setOutput('positive-vibes-found', positiveVibesFound.toString());
    core.setOutput('total-positive-prs', totalPositivePRs.toString());
    core.setOutput('message', message);
    core.setOutput('contributors-stats', JSON.stringify(contributorStats));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    core.setFailed(`Action failed: ${errorMessage}`);
  }
}

if (require.main === module) {
  void run();
}