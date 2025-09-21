import { getOctokit } from '@actions/github';
import type { PullRequest, PRData } from './types';

export class GitHubAPI {
  private octokit: ReturnType<typeof getOctokit>;

  constructor(token: string) {
    this.octokit = getOctokit(token);
  }

  async getMergedPRs(
    owner: string,
    repo: string,
    daysLookback: number = 7,
  ): Promise<PullRequest[]> {
    const since = new Date();
    since.setDate(since.getDate() - daysLookback);

    try {
      const { data: pulls } = await this.octokit.rest.pulls.list({
        owner,
        repo,
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
      });

      return pulls.filter((pr) => {
        if (!pr.merged_at) return false;

        const mergedDate = new Date(pr.merged_at);
        return mergedDate >= since;
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch PRs: ${errorMessage}`);
    }
  }

  extractPRData(pr: PullRequest): PRData {
    return {
      number: pr.number,
      title: pr.title,
      user: pr.user?.login || 'unknown',
      mergedAt: pr.merged_at || '',
      htmlUrl: pr.html_url,
      baseBranch: pr.base?.ref || 'unknown',
      headBranch: pr.head?.ref || 'unknown',
    };
  }
}
