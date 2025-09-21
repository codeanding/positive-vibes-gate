import * as core from '@actions/core';
import * as github from '@actions/github';
import { countPositiveEmojis, hasPositiveEmoji, parsePositiveEmojis } from './emojis';

export async function run(): Promise<void> {
  try {
    const positiveEmojisInput = core.getInput('positive-emojis');

    const positiveEmojis = parsePositiveEmojis(positiveEmojisInput);

    const prTitle = github.context.payload.pull_request?.title || '';
    const prNumber = github.context.payload.pull_request?.number || 0;

    core.info(`🔍 Checking positive vibes for PR #${prNumber}...`);
    core.info(`📝 PR Title: "${prTitle}"`);
    core.info(`✨ Looking for these emojis: ${positiveEmojis.join(' ')}`);

    // Check if PR title has positive emojis
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

    // Set outputs
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    core.setFailed(`Action failed: ${errorMessage}`);
  }
}

if (require.main === module) {
  void run();
}
