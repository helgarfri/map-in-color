import React from 'react';
import styles from './WhoIsItForSection.module.css';

function ChartIcon() {
  return (
    <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3v18h18" />
      <path d="M7 14l4-4 4 4 5-7" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg className={styles.cardIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

const AUDIENCES = [
  {
    id: 'researchers',
    title: 'Researchers & Analysts',
    description: 'Turn structured datasets into interactive maps to explore patterns, compare regions, and present findings clearly.',
    Icon: ChartIcon,
    accent: 'cyan',
  },
  {
    id: 'educators',
    title: 'Educators & Students',
    description: 'Create visual maps for projects, presentations, and classroom discussions — no technical setup required.',
    Icon: BookIcon,
    accent: 'azure',
  },
  {
    id: 'journalists',
    title: 'Journalists & Storytellers',
    description: 'Add geographic context to your stories with interactive, shareable maps that readers can explore.',
    Icon: PenIcon,
    accent: 'magenta',
  },
  {
    id: 'creators',
    title: 'Data Creators & Curious Minds',
    description: 'Design custom maps to visualize global trends, highlight insights, and share ideas with the world.',
    Icon: LightbulbIcon,
    accent: 'orange',
  },
];

function WhoIsItForSection() {
  return (
    <section className={styles.section} aria-labelledby="who-is-it-for-title">
      <div className={styles.inner}>
        <div className={styles.titleBlock}>
          <h2 id="who-is-it-for-title" className={styles.title}>
            Who is Map in Color for?
          </h2>
          <p className={styles.subtitle}>
            Whether you work with data, teach, write, or simply love exploring the world — mapping made simple.
          </p>
        </div>

        <div className={styles.cardGrid}>
          {AUDIENCES.map(({ id, title, description, Icon, accent }) => (
            <article
              key={id}
              className={`${styles.card} ${styles[`cardAccent_${accent}`]}`}
            >
              <div className={styles.cardIconWrap}>
                <Icon />
              </div>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhoIsItForSection;
