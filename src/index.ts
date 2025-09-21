import * as core from '@actions/core';
import * as github from '@actions/github';
import { countPositiveEmojis, hasPositiveEmoji, parsePositiveEmojis } from './emojis';
import { GitHubAPI } from './github-api';
import type { ContributorStats, PositivePR } from './types';

async function runPRMode(positiveEmojis: string[]): Promise<void> {
  const prTitle = github.context.payload.pull_request?.title || '';
  const prNumber = github.context.payload.pull_request?.number || 0;

  core.info(`🔍 Checking positive vibes for PR #${prNumber}...`);
  core.info(`📝 PR Title: "${prTitle}"`);
  core.info(`✨ Looking for these emojis: ${positiveEmojis.join(' ')}`);

  const hasPositiveVibes = hasPositiveEmoji(prTitle, positiveEmojis);
  const emojiCount = countPositiveEmojis(prTitle, positiveEmojis);

  let message: string;
  if (hasPositiveVibes) {
    message = `✅ POSITIVE VIBES DETECTED! 🎉\nThis PR spreads joy with ${emojiCount} positive emoji(s)!\nPR #${prNumber}: "${prTitle}"`;
    core.info(message);
  } else {
    message = `❌ PR BLOCKED! 🚫\nThis PR lacks positive vibes!\nPR #${prNumber}: "${prTitle}"\nAdd some joy to your PR title: ${positiveEmojis
      .slice(0, 10)
      .join(' ')}`;
    core.setFailed(message);
  }

  core.setOutput('positive-vibes-found', hasPositiveVibes.toString());
  core.setOutput('total-positive-prs', hasPositiveVibes ? '1' : '0');
  core.setOutput('message', message);
  core.setOutput(
    'contributors-stats',
    JSON.stringify({
      [github.context.payload.pull_request?.user?.login || 'unknown']: {
        username: github.context.payload.pull_request?.user?.login || 'unknown',
        positivePRs: hasPositiveVibes ? 1 : 0,
        totalEmojis: emojiCount,
        prs: hasPositiveVibes
          ? [
              {
                number: prNumber,
                title: prTitle,
                url: github.context.payload.pull_request?.html_url || '',
                emojiCount,
              },
            ]
          : [],
      },
    }),
  );
}

async function runDeploymentMode(positiveEmojis: string[]): Promise<void> {
  const token = core.getInput('github-token');
  const daysLookback = parseInt(core.getInput('days-lookback')) || 7;
  const requireCount = parseInt(core.getInput('require-count')) || 1;

  const githubApi = new GitHubAPI(token);
  const { owner, repo } = github.context.repo;

  core.info(`🔍 Scanning team's positive vibes for deployment gate...`);
  core.info(`📅 Looking back ${daysLookback} days for merged PRs`);
  core.info(`🎯 Need ${requireCount} positive emoji PR(s) to deploy`);
  core.info(`✨ Looking for these emojis: ${positiveEmojis.join(' ')}`);

  const mergedPRs = await githubApi.getMergedPRs(owner, repo, daysLookback);
  const positivePRs: PositivePR[] = [];
  const contributorStats: Record<string, ContributorStats> = {};

  mergedPRs.forEach((pr) => {
    const prData = githubApi.extractPRData(pr);
    const emojiCount = countPositiveEmojis(prData.title, positiveEmojis);

    if (emojiCount > 0) {
      positivePRs.push({
        ...prData,
        emojiCount,
      });

      if (!contributorStats[prData.user]) {
        contributorStats[prData.user] = {
          username: prData.user,
          positivePRs: 0,
          totalEmojis: 0,
          prs: [],
        };
      }

      contributorStats[prData.user].positivePRs++;
      contributorStats[prData.user].totalEmojis += emojiCount;
      contributorStats[prData.user].prs.push({
        number: prData.number,
        title: prData.title,
        url: prData.htmlUrl,
        emojiCount,
      });
    }
  });

  const hasEnoughPositiveVibes = positivePRs.length >= requireCount;

  let message: string;
  if (hasEnoughPositiveVibes) {
    message = `✅ DEPLOYMENT APPROVED! 🚀\nYour team has ${
      positivePRs.length
    } positive emoji PR(s) in the last ${daysLookback} days!\nSpread by: ${Object.keys(
      contributorStats,
    ).join(', ')}`;
    core.info(message);
  } else {
    message = `❌ DEPLOYMENT BLOCKED! 🚫\nYour team needs ${requireCount} positive emoji PR(s) but only has ${
      positivePRs.length
    }.\nLast ${daysLookback} days scanned. Create a PR with: ${positiveEmojis
      .slice(0, 10)
      .join(' ')}`;
    core.setFailed(message);
  }

  core.setOutput('positive-vibes-found', hasEnoughPositiveVibes.toString());
  core.setOutput('total-positive-prs', positivePRs.length.toString());
  core.setOutput('message', message);
  core.setOutput('contributors-stats', JSON.stringify(contributorStats));
}

async function runLastMergeMode(positiveEmojis: string[]): Promise<void> {
  const token = core.getInput('github-token');
  const githubApi = new GitHubAPI(token);
  const { owner, repo } = github.context.repo;

  core.info(`🔍 Checking last merged PR for positive vibes...`);
  core.info(`✨ Looking for these emojis: ${positiveEmojis.join(' ')}`);

  try {
    const mergedPRs = await githubApi.getMergedPRs(owner, repo, 1);

    if (mergedPRs.length === 0) {
      const message = `❌ DEPLOYMENT BLOCKED! 🚫\nNo merged PRs found in the last day.\nCreate and merge a PR with positive vibes: ${positiveEmojis
        .slice(0, 10)
        .join(' ')}`;
      core.setFailed(message);
      core.setOutput('positive-vibes-found', 'false');
      core.setOutput('total-positive-prs', '0');
      core.setOutput('message', message);
      core.setOutput('contributors-stats', JSON.stringify({}));
      return;
    }

    const lastPR = githubApi.extractPRData(mergedPRs[0]);
    const emojiCount = countPositiveEmojis(lastPR.title, positiveEmojis);
    const hasPositiveVibes = emojiCount > 0;

    core.info(`📝 Last merged PR #${lastPR.number}: "${lastPR.title}"`);
    core.info(`👤 By: ${lastPR.user}`);

    let message: string;
    if (hasPositiveVibes) {
      message = `✅ DEPLOYMENT APPROVED! 🚀\nLast merged PR has positive vibes!\nPR #${lastPR.number}: "${lastPR.title}" by ${lastPR.user}\nFound ${emojiCount} positive emoji(s)`;
      core.info(message);
    } else {
      message = `❌ DEPLOYMENT BLOCKED! 🚫\nLast merged PR lacks positive vibes!\nPR #${
        lastPR.number
      }: "${lastPR.title}" by ${lastPR.user}\nAdd positive vibes to your next PR: ${positiveEmojis
        .slice(0, 10)
        .join(' ')}`;
      core.setFailed(message);
    }

    core.setOutput('positive-vibes-found', hasPositiveVibes.toString());
    core.setOutput('total-positive-prs', hasPositiveVibes ? '1' : '0');
    core.setOutput('message', message);
    core.setOutput(
      'contributors-stats',
      JSON.stringify({
        [lastPR.user]: {
          username: lastPR.user,
          positivePRs: hasPositiveVibes ? 1 : 0,
          totalEmojis: emojiCount,
          prs: hasPositiveVibes
            ? [
                {
                  number: lastPR.number,
                  title: lastPR.title,
                  url: lastPR.htmlUrl,
                  emojiCount,
                },
              ]
            : [],
        },
      }),
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to check last merged PR: ${errorMessage}`);
  }
}

export async function run(): Promise<void> {
  try {
    const positiveEmojisInput = core.getInput('positive-emojis');
    const mode = core.getInput('mode') || 'deployment';
    const positiveEmojis = parsePositiveEmojis(positiveEmojisInput);

    core.info(`🎯 Running in ${mode} mode`);

    if (mode === 'pr') {
      await runPRMode(positiveEmojis);
    } else if (mode === 'deployment') {
      await runDeploymentMode(positiveEmojis);
    } else if (mode === 'last-merge') {
      await runLastMergeMode(positiveEmojis);
    } else {
      throw new Error(`Invalid mode: ${mode}. Use 'pr', 'deployment', or 'last-merge'`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    core.setFailed(`Action failed: ${errorMessage}`);
  }
}

if (require.main === module) {
  void run();
}
