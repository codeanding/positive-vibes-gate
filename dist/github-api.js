"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubAPI = void 0;
const github_1 = require("@actions/github");
class GitHubAPI {
    octokit;
    constructor(token) {
        this.octokit = (0, github_1.getOctokit)(token);
    }
    async getMergedPRs(owner, repo, daysLookback = 7) {
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
                if (!pr.merged_at)
                    return false;
                const mergedDate = new Date(pr.merged_at);
                return mergedDate >= since;
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to fetch PRs: ${errorMessage}`);
        }
    }
    extractPRData(pr) {
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
exports.GitHubAPI = GitHubAPI;
//# sourceMappingURL=github-api.js.map