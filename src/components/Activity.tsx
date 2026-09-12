import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../assets/styles/Activity.scss';
import tugFinal from '../assets/images/tug-of-war-final.jpeg';
import tugWiring from '../assets/images/tug-of-war-wiring.jpeg';
import tugArduino from '../assets/images/tug-of-war-arduino.jpeg';
import tugHolding from '../assets/images/tug-of-war-holding.jpeg';

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

        {/* ── Side Quest Block ────────────────────────────────────────────── */}
        <div className="side-quest-block">
          <div className="activity-subheading side-quest-subheading">
            <div className="side-quest-badge">
              <span className="side-quest-badge__icon" aria-hidden="true">🎮</span>
              <span>Just for fun — not a resume project</span>
            </div>
            <h2>Side Quest: Digital Tug of War</h2>
            <p className="side-quest-description">
              Built as a late night hardware jam, this is a physical two player tug of war game using a 60 LED addressable strip as the glowing rope. Players furiously mash arcade buttons to yank the red LED &ldquo;flag&rdquo; to their endzone, trigger a one time, high voltage BOOST power move when pinned, and wave over an ultrasonic sensor for an instant touchless kickoff.
            </p>
          </div>

          <div className="side-quest-tags" aria-label="Project features">
            <span className="side-quest-tag side-quest-tag--leds">
              <span className="side-quest-tag__emoji" aria-hidden="true">🌈</span> 60 addressable LEDs
            </span>
            <span className="side-quest-tag side-quest-tag--sensor">
              <span className="side-quest-tag__emoji" aria-hidden="true">👋</span> Touchless start
            </span>
            <span className="side-quest-tag side-quest-tag--buzzer">
              <span className="side-quest-tag__emoji" aria-hidden="true">🔊</span> Buzzer feedback
            </span>
            <span className="side-quest-tag side-quest-tag--boost">
              <span className="side-quest-tag__emoji" aria-hidden="true">💥</span> One-time BOOST move
            </span>
          </div>

          <motion.div
            className="side-quest-scrapbook"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: reducedMotion ? 0 : 0.12,
                },
              },
            }}
          >
            {[
              {
                id: 'final',
                image: tugFinal,
                alt: 'Digital Tug of War finished build glowing with paper backdrop and vibrant LED strip',
                caption: 'The finished build ✨',
                rot: -5,
                xOffset: -24,
                yOffset: 20,
              },
              {
                id: 'wiring',
                image: tugWiring,
                alt: 'Top-down view of the breadboard, wiring chaos, push buttons, and LED strip assembly',
                caption: 'Wiring chaos 🔌',
                rot: 4,
                xOffset: 16,
                yOffset: -16,
              },
              {
                id: 'arduino',
                image: tugArduino,
                alt: 'Close-up of Arduino Uno microcontroller and breadboard jumper wires',
                caption: 'Brains of the operation 🧠',
                rot: -3,
                xOffset: -12,
                yOffset: 24,
              },
              {
                id: 'holding',
                image: tugHolding,
                alt: 'Teammate holding the hand-painted starry night sky MDF enclosure',
                caption: 'Starry night finish 🎨',
                rot: 6,
                xOffset: 20,
                yOffset: -12,
              },
            ].map((photo, index) => (
              <motion.div
                key={photo.id}
                className={`side-quest-polaroid side-quest-polaroid--${index + 1}`}
                variants={{
                  hidden: reducedMotion
                    ? { opacity: 0 }
                    : {
                      opacity: 0,
                      x: photo.xOffset,
                      y: photo.yOffset,
                      rotate: photo.rot * 1.8,
                      scale: 0.92,
                    },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: reducedMotion ? 0 : photo.rot,
                    scale: 1,
                    transition: {
                      duration: reducedMotion ? 0.3 : 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                whileHover={
                  reducedMotion
                    ? undefined
                    : {
                      rotate: 0,
                      scale: 1.05,
                      y: -8,
                      zIndex: 20,
                      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                    }
                }
              >
                <div className="side-quest-polaroid__image-wrap">
                  <img src={photo.image} alt={photo.alt} loading="lazy" />
                </div>
                <p className="side-quest-polaroid__caption">{photo.caption}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default GitHubActivity;
