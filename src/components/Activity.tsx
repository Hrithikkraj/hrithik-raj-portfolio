import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../assets/styles/Activity.scss';

const GITHUB_USERNAME = 'Hrithikkraj';
const GITHUB_PROFILE = `https://github.com/${GITHUB_USERNAME}`;
const CONTRIBUTION_GRAPH = `https://ghchart.rshah.org/7c3aed/${GITHUB_USERNAME}`;
const LEETCODE_USERNAME = 'Hrithikk_Raj';
const LEETCODE_PROFILE = `https://leetcode.com/u/${LEETCODE_USERNAME}/`;
const LEETCODE_API = `https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USERNAME}`;

interface GitHubProfile {
  public_repos: number;
  followers: number;
  created_at: string;
}

interface GitHubStats {
  repositories: number;
  followers: number;
  since: number;
}

interface LeetCodeProfile {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
}

function useCountUp(target: number | null, active: boolean, reducedMotion: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === null || !active) return;

    if (reducedMotion) {
      setValue(target);
      return;
    }

    let frameId = 0;
    const startedAt = performance.now();
    const duration = 900;

    const update = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [active, reducedMotion, target]);

  return value;
}

const GitHubActivity: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [leetcodeStats, setLeetcodeStats] = useState<LeetCodeProfile | null>(null);
  const [leetcodeLoading, setLeetcodeLoading] = useState(true);
  const [leetcodeError, setLeetcodeError] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then(response => {
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
        return response.json() as Promise<GitHubProfile>;
      })
      .then(profile => {
        if (!isMounted) return;
        setStats({
          repositories: profile.public_repos,
          followers: profile.followers,
          since: new Date(profile.created_at).getFullYear(),
        });
        setHasError(false);
      })
      .catch(error => {
        if (isMounted && error.name !== 'AbortError') setHasError(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    fetch(LEETCODE_API, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`LeetCode API returned ${response.status}`);
        return response.json() as Promise<LeetCodeProfile>;
      })
      .then(profile => {
        const hasNumericStats = [
          profile.totalSolved,
          profile.easySolved,
          profile.mediumSolved,
          profile.hardSolved,
          profile.ranking,
        ].every(value => typeof value === 'number' && Number.isFinite(value));
        if (!isMounted || !hasNumericStats) throw new Error('Incomplete LeetCode profile response');
        setLeetcodeStats(profile);
        setLeetcodeError(false);
      })
      .catch(error => {
        if (isMounted && error.name !== 'AbortError') setLeetcodeError(true);
      })
      .finally(() => {
        if (isMounted) setLeetcodeLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const repositories = useCountUp(stats?.repositories ?? null, hasEntered, reducedMotion);
  const followers = useCountUp(stats?.followers ?? null, hasEntered, reducedMotion);
  const since = useCountUp(stats?.since ?? null, hasEntered, reducedMotion);
  const totalSolved = useCountUp(leetcodeStats?.totalSolved ?? null, hasEntered, reducedMotion);
  const easySolved = useCountUp(leetcodeStats?.easySolved ?? null, hasEntered, reducedMotion);
  const mediumSolved = useCountUp(leetcodeStats?.mediumSolved ?? null, hasEntered, reducedMotion);
  const hardSolved = useCountUp(leetcodeStats?.hardSolved ?? null, hasEntered, reducedMotion);
  const ranking = useCountUp(leetcodeStats?.ranking ?? null, hasEntered, reducedMotion);

  const sectionMotion = reducedMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } };

  return (
    <section
      id="github-activity"
      className="github-activity-section"
      aria-labelledby="github-activity-title"
    >
      <motion.div
        className="github-activity-inner"
        {...sectionMotion}
        transition={{ duration: reducedMotion ? 0.35 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        onViewportEnter={() => setHasEntered(true)}
      >
        <div className="github-activity-heading">
          <h1 id="github-activity-title">Activity</h1>
          <p>A live look at what I am building and learning in public.</p>
        </div>

        <div className="activity-subheading">
          <h2>GitHub</h2>
        </div>

        <div className="github-activity-layout">
          <div className="github-graph-card">
            <div className="github-graph-card__topline">
              <span className="github-graph-card__label">Contribution graph</span>
              <span className="github-graph-card__handle">@{GITHUB_USERNAME}</span>
            </div>
            <div className="github-graph-frame">
              <img
                src={CONTRIBUTION_GRAPH}
                alt={`GitHub contribution graph for ${GITHUB_USERNAME}`}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="github-activity-aside">
            <div className="github-activity-aside__intro">
              <span>Open-source snapshot</span>
              <p>Explore the projects, experiments, and ideas I am building in public.</p>
            </div>

            <div className="github-activity-aside__details">
              <div>
                <span className="github-activity-aside__detail-mark" aria-hidden="true">01</span>
                <span>Full-stack products</span>
              </div>
              <div>
                <span className="github-activity-aside__detail-mark" aria-hidden="true">02</span>
                <span>ML and systems experiments</span>
              </div>
              <div>
                <span className="github-activity-aside__detail-mark" aria-hidden="true">03</span>
                <span>Consistent learning in public</span>
              </div>
            </div>

            {!hasError && (
              <div className="github-stats" aria-label="GitHub profile statistics">
                {[
                  ['Repositories', repositories, loading],
                  ['Followers', followers, loading],
                  ['Building since', since, loading],
                ].map(([label, value, isLoading]) => (
                  <div className="github-stat" key={label as string}>
                    {isLoading ? (
                      <span className="github-stat__skeleton" aria-hidden="true" />
                    ) : (
                      <strong>{value}{label === 'Building since' ? '' : ''}</strong>
                    )}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <motion.a
              className="github-profile-button cursor-hover"
              href={GITHUB_PROFILE}
              target="_blank"
              rel="noreferrer"
              whileHover={reducedMotion ? undefined : { scale: 1.04 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            >
              View Full Profile on GitHub
              <span aria-hidden="true">↗</span>
            </motion.a>
          </div>
        </div>

        <div className="leetcode-block">
          <div className="activity-subheading">
            <h2>LeetCode</h2>
            <p>Problem solving beyond the projects.</p>
          </div>

          <div className="leetcode-card">
            {!leetcodeError && (
              <>
                <div className="leetcode-stats" aria-label="LeetCode statistics">
                  <div className="github-stat leetcode-stat--primary">
                    {leetcodeLoading ? (
                      <span className="github-stat__skeleton" aria-hidden="true" />
                    ) : (
                      <strong>{totalSolved}</strong>
                    )}
                    <span>Problems solved</span>
                  </div>
                  <div className="github-stat">
                    {leetcodeLoading ? (
                      <span className="github-stat__skeleton" aria-hidden="true" />
                    ) : (
                      <strong>{ranking.toLocaleString()}</strong>
                    )}
                    <span>Global ranking</span>
                  </div>
                </div>

                <div className="leetcode-difficulty-list" aria-label="Solved problems by difficulty">
                  {[
                    ['Easy', easySolved, 'leetcode-difficulty--easy', leetcodeStats?.totalSolved ?? 1],
                    ['Medium', mediumSolved, 'leetcode-difficulty--medium', leetcodeStats?.totalSolved ?? 1],
                    ['Hard', hardSolved, 'leetcode-difficulty--hard', leetcodeStats?.totalSolved ?? 1],
                  ].map(([label, value, modifier, total]) => (
                    <div className={`leetcode-difficulty ${modifier}`} key={label as string}>
                      <div className="leetcode-difficulty__label">
                        <span>{label}</span>
                        {leetcodeLoading ? (
                          <span className="leetcode-difficulty__skeleton" aria-hidden="true" />
                        ) : (
                          <strong>{value}</strong>
                        )}
                      </div>
                      <div className="leetcode-difficulty__track" aria-hidden="true">
                        <span style={{ width: `${leetcodeLoading ? 0 : Math.min(100, (Number(value) / Number(total)) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <motion.a
              className="github-profile-button cursor-hover"
              href={LEETCODE_PROFILE}
              target="_blank"
              rel="noreferrer"
              whileHover={reducedMotion ? undefined : { scale: 1.04 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            >
              View LeetCode Profile
              <span aria-hidden="true">↗</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default GitHubActivity;
