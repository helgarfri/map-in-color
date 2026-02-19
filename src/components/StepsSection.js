import React, { useRef, useState, useEffect } from 'react';
import UploadDataModal from './UploadDataModal';
import styles from './StepsSection.module.css';

function GlobeIcon() {
  return (
    <svg className={styles.visibilityIconSvg} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm3.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className={styles.visibilityIconSvg} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function CaretDownIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}

function VisibilityDemo({ className }) {
  const [isPublic, setIsPublic] = useState(true);
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);

  return (
    <div className={`${styles.visibilityDemoWrap} ${className || ''}`}>
      <div className={styles.visibilitySection}>
        <h2 className={styles.visibilitySectionTitle}>Map Info</h2>
        <div className={styles.visibilityFieldBlock}>
          <label className={styles.visibilityFieldLabel}>Visibility</label>
          <div
            className={styles.visibilityCustomSelect}
            onClick={() => setShowVisibilityOptions((v) => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowVisibilityOptions((v) => !v);
              }
            }}
          >
            <span className={styles.visibilityIcon}>
              {isPublic ? <GlobeIcon /> : <LockIcon />}
            </span>
            {isPublic ? 'Public' : 'Private'}
            <span className={styles.visibilitySelectArrow}>
              <CaretDownIcon />
            </span>
            {showVisibilityOptions && (
              <div
                className={styles.visibilitySelectOptions}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className={styles.visibilitySelectOption}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPublic(true);
                    setShowVisibilityOptions(false);
                  }}
                >
                  <span className={styles.visibilityIcon}><GlobeIcon /></span>
                  Public
                </button>
                <button
                  type="button"
                  className={styles.visibilitySelectOption}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPublic(false);
                    setShowVisibilityOptions(false);
                  }}
                >
                  <span className={styles.visibilityIcon}><LockIcon /></span>
                  Private
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverConnectDemo({ className }) {
  return (
    <div className={`${styles.commentsWrap} ${className || ''}`}>
      <ul className={styles.commentsList}>
        <li className={styles.commentItem}>
          <div className={styles.commentHeader}>
            <img src="/comment-avatars/lukas.png" alt="" className={styles.commentAvatar} />
            <div className={styles.commentBody}>
              <div className={styles.commentMeta}>
                <span className={styles.commentAuthor}>lukasmeyer</span>
                <span className={styles.commentDot}>•</span>
                <span className={styles.commentTime}>3 hours ago</span>
              </div>
              <p className={styles.commentContent}>
                This really highlights the digital divide. Some regions are still far behind.
              </p>
              <div className={styles.commentActions}>
                <span className={styles.actionBtn}>
                  <LikeIcon /> 3
                </span>
                <span className={styles.actionBtn}>
                  <DislikeIcon /> 0
                </span>
                <span className={`${styles.actionBtn} ${styles.replyBtn}`}>
                  <ReplyIcon /> Reply
                </span>
              </div>
            </div>
          </div>
          <ul className={styles.repliesList}>
            <li className={`${styles.commentItem} ${styles.replyItem}`}>
              <div className={styles.commentHeader}>
                <img src="/comment-avatars/elena.png" alt="" className={styles.commentAvatar} />
                <div className={styles.commentBody}>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentAuthor}>elena.maps</span>
                    <span className={styles.commentDot}>•</span>
                    <span className={styles.commentTime}>2 hours ago</span>
                  </div>
                  <p className={styles.commentContent}>
                    Yes, especially parts of Sub-Saharan Africa. The gap is still significant compared to Europe and East Asia.
                  </p>
                  <div className={styles.commentActions}>
                    <span className={styles.actionBtn}><LikeIcon /> 4</span>
                    <span className={styles.actionBtn}><DislikeIcon /> 0</span>
                    <span className={`${styles.actionBtn} ${styles.replyBtn}`}><ReplyIcon /> Reply</span>
                  </div>
                </div>
              </div>
            </li>
            <li className={`${styles.commentItem} ${styles.replyItem}`}>
              <div className={styles.commentHeader}>
                <img src="/comment-avatars/marta.png" alt="" className={styles.commentAvatar} />
                <div className={styles.commentBody}>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentAuthor}>marta.kovacs</span>
                    <span className={styles.commentDot}>•</span>
                    <span className={styles.commentTime}>1 hour ago</span>
                  </div>
                  <p className={styles.commentContent}>
                    I agree. It would be interesting to see this alongside GDP per capita.
                  </p>
                  <div className={styles.commentActions}>
                    <span className={styles.actionBtn}><LikeIcon /> 1</span>
                    <span className={styles.actionBtn}><DislikeIcon /> 0</span>
                    <span className={`${styles.actionBtn} ${styles.replyBtn}`}><ReplyIcon /> Reply</span>
                  </div>
                </div>
              </div>
              <ul className={styles.repliesList}>
                <li className={`${styles.commentItem} ${styles.replyItem}`}>
                  <div className={styles.commentHeader}>
                    <img src="/comment-avatars/elena.png" alt="" className={styles.commentAvatar} />
                    <div className={styles.commentBody}>
                      <div className={styles.commentMeta}>
                        <span className={styles.commentAuthor}>elena.maps</span>
                        <span className={styles.commentDot}>•</span>
                        <span className={styles.commentTime}>42 minutes ago</span>
                      </div>
                      <p className={styles.commentContent}>
                        That&apos;s a great idea. I&apos;m thinking about creating a follow-up comparing income levels and internet usage.
                      </p>
                      <div className={styles.commentActions}>
                        <span className={styles.actionBtn}><LikeIcon /> 0</span>
                        <span className={styles.actionBtn}><DislikeIcon /> 0</span>
                        <span className={`${styles.actionBtn} ${styles.replyBtn}`}><ReplyIcon /> Reply</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

function LikeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.22L23 12.41V10z" />
    </svg>
  );
}
function DislikeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06l1.39 1.41 6.58-6.59c.36-.36.59-.86.59-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
    </svg>
  );
}
function ReplyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden style={{ transform: 'scaleX(-1)' }}>
      <path d="M10 9V5l-7 7 7 7v-4.1c4.55 0 7.83 1.24 10.27 3.32-.4-4.28-2.92-7.39-10.27-7.39z" />
    </svg>
  );
}

const STEPS = [
  {
    id: 'step-1',
    number: '01',
    title: 'Smart Data Upload',
    description: 'Upload a CSV and our system automatically detects structure, identifies country codes, and determines whether your data is choropleth or categorical.',
    subtext: 'Manual control always available.',
    imageSlot: 'step1',
    imageSrc: null,
    customContent: true,
    customComponent: 'uploadModal',
  },
  {
    id: 'step-2',
    number: '02',
    title: 'Full Design Control',
    description: 'Customize colors, ranges, legends, labels, and layout in real time.',
    subtext: 'Fine-tune everything until it looks exactly how you want.',
    imageSlot: 'step2',
    imageSrc: '/assets/3-0/steps2.png',
  },
  {
    id: 'step-3',
    number: '03',
    title: 'You Own Your Map',
    description: 'Every map belongs to you.',
    subtext: 'Choose whether it\'s public or private. Edit anytime. Control who sees it.',
    imageSlot: 'step3',
    imageSrc: null,
    customContent: true,
    customComponent: 'visibility',
  },
  {
    id: 'step-4',
    number: '04',
    title: 'Share Anywhere',
    description: 'Publish on Map in Color, embed on your website, or download high-quality images for social media.',
    subtext: 'Interactive or static — your choice.',
    imageSlot: 'step4',
    imageSrc: '/assets/3-0/steps4.png',
  },
  {
    id: 'step-5',
    number: '05',
    title: 'Discover & Connect',
    description: 'Explore community maps, star your favorites, download datasets, and interact with other creators.',
    subtext: 'Mapping is better together.',
    imageSlot: 'step5',
    imageSrc: null,
    customContent: true,
  },
];

function StepsSection() {
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [step1UploadSession, setStep1UploadSession] = useState({});

  const setSectionRef = (index) => (el) => {
    if (el) sectionRefs.current[index] = el;
  };

  const scrollToStep = (index) => {
    const el = sectionRefs.current[index];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const refs = sectionRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const index = STEPS.findIndex((s) => s.id === id);
          if (index !== -1) setActiveIndex(index);
        });
      },
      { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    refs.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav} aria-label="How it works">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              type="button"
              className={`${styles.sidebarItem} ${activeIndex === index ? styles.sidebarItemActive : ''}`}
              onClick={() => scrollToStep(index)}
              aria-current={activeIndex === index ? 'step' : undefined}
            >
              <span className={styles.sidebarNumber}>{step.number}</span>
              <span className={styles.sidebarLabel}>{step.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className={styles.sections}>
        {STEPS.map((step, index) => (
          <section
            key={step.id}
            id={step.id}
            ref={setSectionRef(index)}
            className={styles.stepSection}
            aria-labelledby={`${step.id}-title`}
          >
            <div className={styles.stepContent}>
              <div className={styles.stepTextBlock}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h2 id={`${step.id}-title`} className={styles.stepTitle}>
                  {step.title}
                </h2>
                <p className={styles.stepDescription}>{step.description}</p>
                <p className={styles.stepSubtext}>{step.subtext}</p>
              </div>
              <div className={`${styles.stepImageWrap} ${styles[step.imageSlot]}`}>
                {step.customContent && step.customComponent === 'uploadModal' ? (
                  <UploadDataModal
                    embedded
                    isOpen
                    selectedMap="world"
                    session={step1UploadSession}
                    setSession={setStep1UploadSession}
                    onClose={() => {}}
                    onImport={() => {}}
                  />
                ) : step.customContent && step.customComponent === 'visibility' ? (
                  <VisibilityDemo />
                ) : step.customContent ? (
                  <DiscoverConnectDemo className={styles.commentsDemo} />
                ) : step.imageSrc ? (
                  <img src={step.imageSrc} alt="" className={styles.stepImage} />
                ) : null}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default StepsSection;
