import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './index.module.css';

function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <h1 className="hero__title" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
          <Translate id="homepage.title">PicoClaw</Translate>
        </h1>
      </header>
      <div className="container" style={{ textAlign: 'center', padding: '2rem 0' }}>
        {/* <img src="img/logo.webp" alt="PicoClaw" width={180} style={{ borderRadius: '50%', marginBottom: '1rem' }} /> */}
        <p className="hero__subtitle">
          <Translate id="homepage.tagline">
            Ultra-Efficient AI Assistant in Go
          </Translate>
        </p>
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>$10</span>
            <span className={styles.statLabel}><Translate id="homepage.stat.hardware">Hardware</Translate></span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>&lt;10MB</span>
            <span className={styles.statLabel}><Translate id="homepage.stat.ram">RAM Usage</Translate></span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>&lt;1s</span>
            <span className={styles.statLabel}><Translate id="homepage.stat.boot">Boot Time</Translate></span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>400x</span>
            <span className={styles.statLabel}><Translate id="homepage.stat.faster">Faster Startup</Translate></span>
          </div>
        </div>
        <div className={styles.buttons}>
          <Link 
            className="button button--secondary button--lg" 
            to="/docs"
            style={{ backgroundColor: '#00add8', borderColor: '#00add8', color: 'white' }}
          >
            <Translate id="homepage.getStarted">Get Started</Translate>
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="https://github.com/sipeed/picoclaw"
            style={{ color: '#00add8', borderColor: '#00add8', backgroundColor: 'transparent' }}
          >
            GitHub
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="https://discord.gg/V4sAZ9XWpN"
            style={{ color: '#00add8', borderColor: '#00add8', backgroundColor: 'transparent' }}
          >
            Discord
          </Link>
        </div>
      </div>
    </>
  );
}

const FeatureList = [
  {
    icon: '🪶',
    title: translate({ id: 'feature.lightweight.title', message: 'Ultra-Lightweight' }),
    description: translate({
      id: 'feature.lightweight.desc',
      message: 'Less than 10MB memory footprint — 99% smaller than comparable solutions.',
    }),
  },
  {
    icon: '💰',
    title: translate({ id: 'feature.cost.title', message: 'Minimal Cost' }),
    description: translate({
      id: 'feature.cost.desc',
      message: 'Runs on $10 hardware. 98% cheaper than a Mac mini.',
    }),
  },
  {
    icon: '⚡️',
    title: translate({ id: 'feature.fast.title', message: 'Lightning Fast' }),
    description: translate({
      id: 'feature.fast.desc',
      message: '400x faster startup. Boots in under 1 second even on a 0.6GHz single core.',
    }),
  },
  {
    icon: '🌍',
    title: translate({ id: 'feature.portable.title', message: 'True Portability' }),
    description: translate({
      id: 'feature.portable.desc',
      message: 'Single self-contained binary for RISC-V, ARM64, and x86_64.',
    }),
  },
  {
    icon: '💬',
    title: translate({ id: 'feature.channels.title', message: 'Multi-Channel' }),
    description: translate({
      id: 'feature.channels.desc',
      message: 'Connect via Telegram, Discord, Slack, DingTalk, Feishu, WeCom, LINE, QQ and more.',
    }),
  },
  {
    icon: '🤖',
    title: translate({ id: 'feature.ai.title', message: 'AI-Bootstrapped' }),
    description: translate({
      id: 'feature.ai.desc',
      message: '95% agent-generated core with human-in-the-loop refinement.',
    }),
  },
];

function Feature({ icon, title, description }) {
  return (
    <div className={clsx('col col--4')} style={{ marginBottom: '2rem' }}>
      <div className="text--center" style={{ fontSize: '3rem' }}>{icon}</div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageCommunity() {
  return (
    <section className={styles.community}>
      <div className="container">
        <h2 className="text--center">
          <Translate id="community.title">Join the Community</Translate>
        </h2>
        <div className={styles.communityGrid}>
          <div className={styles.communityCard}>
            <Link to="https://github.com/sipeed/picoclaw/blob/main/assets/wechat.png">
              <img
                src="https://raw.githubusercontent.com/sipeed/picoclaw/main/assets/wechat.png"
                alt="WeChat Group QR Code"
                className={styles.qrCode}
              />
            </Link>
            <p className={styles.communityLabel}>
              <Translate id="community.wechat">WeChat Group</Translate>
            </p>
          </div>
          <div className={styles.communityLinks}>
            <Link className="button button--outline button--primary button--lg" to="https://discord.gg/V4sAZ9XWpN">
              💬 Discord
            </Link>
            <Link className="button button--outline button--primary button--lg" to="https://github.com/sipeed/picoclaw/discussions">
              <Translate id="community.discussions">GitHub Discussions</Translate>
            </Link>
            <Link className="button button--outline button--primary button--lg" to="https://github.com/sipeed">
              <Translate id="community.sipeedGitHub">Sipeed GitHub</Translate>
            </Link>
            <Link className="button button--outline button--primary button--lg" to="https://x.com/SipeedIO">
              <Translate id="community.sipeedTwitter">Sipeed Twitter</Translate>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Ultra-Efficient AI Assistant in Go — $10 Hardware, 10MB RAM, 1s Boot"
    >
      <HomepageHero />
      <main>
        <HomepageFeatures />
        <HomepageCommunity />
      </main>
    </Layout>
  );
}
