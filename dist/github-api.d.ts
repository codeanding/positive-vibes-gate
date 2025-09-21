import type { PullRequest, PRData } from './types';
export declare class GitHubAPI {
    private octokit;
    constructor(token: string);
    getMergedPRs(owner: string, repo: string, daysLookback?: number): Promise<PullRequest[]>;
    extractPRData(pr: PullRequest): PRData;
}
//# sourceMappingURL=github-api.d.ts.map