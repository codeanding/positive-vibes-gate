import type { RestEndpointMethodTypes } from '@octokit/rest';
export type PullRequest = RestEndpointMethodTypes['pulls']['list']['response']['data'][0];
export interface PRData {
    number: number;
    title: string;
    user: string;
    mergedAt: string;
    htmlUrl: string;
    baseBranch: string;
    headBranch: string;
}
export interface PositivePR extends PRData {
    emojiCount: number;
}
export interface PRSummary {
    number: number;
    title: string;
    url: string;
    emojiCount: number;
}
export interface ContributorStats {
    username: string;
    positivePRs: number;
    totalEmojis: number;
    prs: PRSummary[];
}
export interface ContributorStatsMap {
    [username: string]: ContributorStats;
}
//# sourceMappingURL=types.d.ts.map