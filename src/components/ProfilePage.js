import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { SidebarContext } from "../context/SidebarContext";
import useWindowSize from "../hooks/useWindowSize";

import Sidebar from "./Sidebar";
import Header from "./Header";
import StaticMapThumbnail from "./StaticMapThumbnail";
import ProfileActivityFeed from "./ProfileActivityFeed";
import ProBadge, { isProUser } from "./ProBadge";

import {
  fetchUserProfileByUsername,
  fetchMapsByuser_id,
  fetchStarredMapsByuser_id,
  fetchUserMapStats,
  reportProfile,
} from "../api";

import {
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaStar,
  FaMap,
  FaBookmark,
  FaListUl,
  FaLock,
  FaFlag,
} from "react-icons/fa";

import { formatDistanceToNow } from "date-fns";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();

  const { profile: currentUserProfile, authToken } = useContext(UserContext);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();



  const isUserLoggedIn = !!authToken && !!currentUserProfile;

  // Profile
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  const isMyProfile = useMemo(() => {
    return currentUserProfile && currentUserProfile.username === profile?.username;
  }, [currentUserProfile, profile]);

  // Stats
  const [totalPublicMaps, setTotalPublicMaps] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  // Maps section state
  const [userMaps, setUserMaps] = useState([]);
  const [loadingMaps, setLoadingMaps] = useState(false);
  const [mapsPage, setMapsPage] = useState(1);
  const mapsPerPage = 12;
  const [mapsTotal, setMapsTotal] = useState(0);
  const [sortMapsBy, setSortMapsBy] = useState("newest");

  // Starred section state
  const [starredMaps, setStarredMaps] = useState([]);
  const [loadingStarred, setLoadingStarred] = useState(false);
  const [starredPage, setStarredPage] = useState(1);
  const starredPerPage = 24;
  const [starredTotal, setStarredTotal] = useState(0);
  const [sortStarredBy, setSortStarredBy] = useState("newest");

  // Report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReasons, setReportReasons] = useState("");
  const reportDetailsRef = useRef("");
  const [isReporting, setIsReporting] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  // 1) Load profile
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoadingProfile(true);
        const res = await fetchUserProfileByUsername(username);
        const found = res.data;
        setProfile(found);

        setProfilePictureUrl(
          found?.profile_picture ? found.profile_picture : "/images/default-profile-picture.png"
        );
      } catch (err) {
        console.error("Error fetching profile:", err);


       const status = err?.response?.status;
       if (status === 403) {
         // banned / blocked / not allowed
         setProfile({ username, status: "banned" });
         setProfilePictureUrl("/images/default-profile-picture.png");
         return;
       }
        navigate("/404");
      } finally {
        setLoadingProfile(false);
      }
    }
    loadUserProfile();
  }, [username, navigate]);

  // 2) Load stats
  useEffect(() => {
    if (!profile) return;
    (async () => {
      try {
        const res = await fetchUserMapStats(profile.id);
        setTotalPublicMaps(res.data.totalPublicMaps);
        setTotalStars(res.data.totalStars);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    })();
  }, [profile]);

  // 3) Load maps (always shown on page)
  useEffect(() => {
    if (!profile) return;
    async function fetchMapsFn() {
      try {
        setLoadingMaps(true);
        const res = await fetchMapsByuser_id(profile.id, mapsPage, mapsPerPage, sortMapsBy);
        setUserMaps(res.data.maps);
        setMapsTotal(res.data.total);
      } catch (err) {
        console.error("Error fetching user maps:", err);
      } finally {
        setLoadingMaps(false);
      }
    }
    fetchMapsFn();
  }, [profile, mapsPage, mapsPerPage, sortMapsBy]);

  // 4) Load starred (only if allowed)
  useEffect(() => {
    if (!profile) return;
    if (profile.show_saved_maps === false) return;

    async function fetchStarredFn() {
      try {
        setLoadingStarred(true);
        const res = await fetchStarredMapsByuser_id(profile.id, starredPage, starredPerPage, sortStarredBy);
        setStarredMaps(res.data.maps);
        setStarredTotal(res.data.total);
      } catch (err) {
        console.error("Error fetching starred maps:", err);
      } finally {
        setLoadingStarred(false);
      }
    }
    fetchStarredFn();
  }, [profile, starredPage, starredPerPage, sortStarredBy]);

  // Private profile gate
  const isPrivate = profile?.profile_visibility === "onlyMe";
  if (!loadingProfile && profile && isPrivate && !isMyProfile) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <div className={`${styles.shell} ${isCollapsed ? styles.shellCollapsed : ""}`}>
          <Header title={profile.username} />
          <main className={styles.main}>
            <div className={styles.privateCard}>
              <div className={styles.privateIconWrap}>
                <FaLock />
              </div>
              <h2 className={styles.privateTitle}>This profile is private.</h2>
              <p className={styles.privateText}>You can’t view this user’s maps or activity.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Banned profile gate
if (!loadingProfile && profile?.status === "banned") {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={`${styles.shell} ${isCollapsed ? styles.shellCollapsed : ""}`}>
        <Header title="Profile unavailable" />
        <main className={styles.main}>
          <div className={styles.privateCard}>
            <div className={styles.privateIconWrap}>
              <FaLock />
            </div>
            <h2 className={styles.privateTitle}>This account is not active.</h2>
            <p className={styles.privateText}>
              If you believe this is a mistake, contact{" "}
              <a href="mailto:support@mapincolor.com">support@mapincolor.com</a>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}


  // Loading skeleton
  if (loadingProfile) {
    return (
      <div className={styles.page}>
        <Sidebar  />
        <div className={`${styles.shell} ${isCollapsed ? styles.shellCollapsed : ""}`}>
          <Header />
          <main className={styles.main}>
            <ProfileSkeleton />
          </main>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <Sidebar  />
        <div className={`${styles.shell} ${isCollapsed ? styles.shellCollapsed : ""}`}>
          <Header  title="User Not Found" />
          <main className={styles.main}>
            <div className={styles.errorCard}>Profile not found.</div>
          </main>
        </div>
      </div>
    );
  }

  // Pagination helpers
  const mapsTotalPages = Math.max(1, Math.ceil(mapsTotal / mapsPerPage));
  const starredTotalPages = Math.max(1, Math.ceil(starredTotal / starredPerPage));

  const handleMapsPageChange = (newPage) => {
    if (newPage < 1 || newPage > mapsTotalPages) return;
    setMapsPage(newPage);
    document.getElementById("maps")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStarredPageChange = (newPage) => {
    if (newPage < 1 || newPage > starredTotalPages) return;
    setStarredPage(newPage);
    document.getElementById("starred")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  function renderMapCard(map) {
    const title = map.title || "Untitled Map";
    return (
      <div key={map.id} className={styles.mapCard} onClick={() => navigate(`/map/${map.id}`)}>
        <div className={styles.mapThumb}>
          <StaticMapThumbnail map={map} background="#dddddd" />
        </div>
        <div className={styles.mapBody}>
          <div className={styles.mapTitle} title={title}>
            {title}
          </div>
          <div className={styles.mapMetaRow}>
            <span className={styles.mapMetaMuted}>
              Modified {formatDistanceToNow(new Date(map.updated_at), { addSuffix: true })}
            </span>
            <span className={styles.mapMetaStars}>
              <FaStar /> {map.save_count || 0}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const dobLabel = profile?.date_of_birth
    ? new Date(profile.date_of_birth).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      })
    : null;

  const showLocation = !!profile.location && profile.show_location;
  const showDob = !!profile.date_of_birth && profile.show_date_of_birth;

  // Report
  function openReport() {
    if (!isUserLoggedIn) return navigate("/login");
    setShowReportModal(true);
  }

  async function submitReport() {
    if (!profile?.username) return;
    if (!reportReasons) return;

    setIsReporting(true);
    try {
      await reportProfile(profile.username, {
        reasons: [reportReasons],
        details: reportDetailsRef.current,
      });
      setShowReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setShowReportSuccess(false);
        setReportReasons("");
        reportDetailsRef.current = "";
      }, 1500);
    } catch (err) {
      console.error("Error reporting profile:", err);
    } finally {
      setIsReporting(false);
    }
  }

  return (
    <div className={styles.page}>
      <Sidebar  />

      <div className={`${styles.shell} ${isCollapsed ? styles.shellCollapsed : ""}`}>
        <Header  title={profile.username} />

        <main className={styles.main}>
          {/* HERO */}
          <section className={styles.heroCard}>
            <div className={styles.heroLeft}>
              <div className={styles.avatarWrap}>
                <img className={styles.avatar} src={profilePictureUrl} alt="Profile" />
              </div>

              <div className={styles.heroText}>
                <div className={styles.heroNameRow}>
                  <div className={styles.heroNameAndBadge}>
                    <div className={styles.heroName}>
                      {(profile.first_name || profile.last_name)
                        ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                        : `@${profile.username}`}
                    </div>
                    <ProBadge show={isProUser(profile)} />
                  </div>
                  <div className={styles.heroHandle}>@{profile.username}</div>
                </div>

                <div className={styles.heroMetaRow}>
                  {showLocation && (
                    <span className={styles.chip}>
                      <FaMapMarkerAlt /> {profile.location}
                    </span>
                  )}
                  {showDob && (
                    <span className={styles.chipMuted}>
                      <FaBirthdayCake /> {dobLabel}
                    </span>
                  )}
                  {isPrivate && isMyProfile && (
                    <span className={styles.chipDanger}>
                      <FaLock /> Private profile
                    </span>
                  )}
                </div>

                {profile.description && (
                  <div className={styles.heroBio}>
                    {profile.description}
                  </div>
                )}

                <div className={styles.heroStatsRow}>
                  <div className={styles.statPill}>
                    <FaMap /> <span>{totalPublicMaps}</span> <span className={styles.statLabel}>Maps</span>
                  </div>
                  <div className={styles.statPill}>
                    <FaStar /> <span>{totalStars}</span> <span className={styles.statLabel}>Stars</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.heroRight}>
              {isMyProfile ? (
                <button className={styles.pillBtn} type="button" onClick={() => navigate("/settings")}>
                  Edit profile
                </button>
              ) : (
                isUserLoggedIn && (
                  <button className={styles.pillBtn} type="button" onClick={openReport}>
                    <FaFlag /> Report
                  </button>
                )
              )}

      
            </div>
          </section>

          {/* CONTENT SECTIONS */}
          <div className={styles.stack}>
            {/* MAPS */}
            <section id="maps" className={styles.card}>
              <div className={styles.cardHeaderRow}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.cardTitleRow}>
                    <FaMap className={styles.cardIcon} />
                    <h2 className={styles.cardTitle}>Maps</h2>
                  </div>
                  <div className={styles.cardSub}>
                    Public maps created by <b>@{profile.username}</b>
                  </div>
                </div>

                <div className={styles.cardHeaderRight}>
                  <div className={styles.controlRow}>
                    <span className={styles.controlLabel}>Sort</span>
                    <select
                      className={styles.select}
                      value={sortMapsBy}
                      onChange={(e) => {
                        setMapsPage(1);
                        setSortMapsBy(e.target.value);
                      }}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="mostStarred">Most starred</option>
                    </select>
                  </div>

                  {mapsTotal > 0 && (
                    <div className={styles.pagePill}>
                      Page {mapsPage} / {mapsTotalPages}
                    </div>
                  )}
                </div>
              </div>

              {loadingMaps ? (
                <CardsSkeleton />
              ) : userMaps.length === 0 ? (
                <div className={styles.emptyState}>No maps found.</div>
              ) : (
                <div className={styles.gridCards}>{userMaps.map(renderMapCard)}</div>
              )}

              {userMaps.length > 0 && mapsTotalPages > 1 && (
                <Pagination
                  page={mapsPage}
                  pages={mapsTotalPages}
                  onPrev={() => handleMapsPageChange(mapsPage - 1)}
                  onNext={() => handleMapsPageChange(mapsPage + 1)}
                  onPick={(p) => handleMapsPageChange(p)}
                />
              )}
            </section>

            {/* STARRED */}
            <section id="starred" className={styles.card}>
              <div className={styles.cardHeaderRow}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.cardTitleRow}>
                    <FaBookmark className={styles.cardIcon} />
                    <h2 className={styles.cardTitle}>Starred maps</h2>
                  </div>
                  <div className={styles.cardSub}>Maps this user has starred</div>
                </div>

                {profile.show_saved_maps !== false && (
                  <div className={styles.cardHeaderRight}>
                    <div className={styles.controlRow}>
                      <span className={styles.controlLabel}>Sort</span>
                      <select
                        className={styles.select}
                        value={sortStarredBy}
                        onChange={(e) => {
                          setStarredPage(1);
                          setSortStarredBy(e.target.value);
                        }}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="mostStarred">Most starred</option>
                      </select>
                    </div>

                    {starredTotal > 0 && (
                      <div className={styles.pagePill}>
                        Page {starredPage} / {starredTotalPages}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {profile.show_saved_maps === false ? (
                <div className={styles.lockedState}>
                  <FaLock />
                  <span>
                    {isMyProfile ? "You have disabled starred maps." : "This user has disabled starred maps."}
                  </span>
                </div>
              ) : loadingStarred ? (
                <CardsSkeleton />
              ) : starredMaps.length === 0 ? (
                <div className={styles.emptyState}>No starred maps.</div>
              ) : (
                <div className={styles.gridCards}>{starredMaps.map(renderMapCard)}</div>
              )}

              {profile.show_saved_maps !== false && starredMaps.length > 0 && starredTotalPages > 1 && (
                <Pagination
                  page={starredPage}
                  pages={starredTotalPages}
                  onPrev={() => handleStarredPageChange(starredPage - 1)}
                  onNext={() => handleStarredPageChange(starredPage + 1)}
                  onPick={(p) => handleStarredPageChange(p)}
                />
              )}
            </section>

            {/* ACTIVITY */}
            <section id="activity" className={styles.card}>
              <div className={styles.cardHeaderRow}>
                <div className={styles.cardHeaderLeft}>
                  <div className={styles.cardTitleRow}>
                    <FaListUl className={styles.cardIcon} />
                    <h2 className={styles.cardTitle}>Activity</h2>
                  </div>
                  <div className={styles.cardSub}>Latest actions and updates</div>
                </div>
              </div>

              {profile.show_activity_feed === false ? (
                <div className={styles.lockedState}>
                  <FaLock />
                  <span>
                    {isMyProfile ? "You have disabled your activity feed." : "This user has disabled their activity feed."}
                  </span>
                </div>
              ) : (
                <div className={styles.activityWrap}>
                  <ProfileActivityFeed username={profile.username} profile_pictureUrl={profilePictureUrl} />
                </div>
              )}
            </section>
          </div>
        </main>

        {/* REPORT MODAL */}
        {showReportModal && (
          <div
            className={`${styles.modalOverlay} ${styles.modalOverlayBlur}`}
            onMouseDown={() => setShowReportModal(false)}
          >
            <div className={styles.modalContent} onMouseDown={(e) => e.stopPropagation()}>
              {isReporting ? (
                <div className={styles.modalState}>
                  <div className={styles.modalTitle}>Submitting report…</div>
                  <div className={styles.modalSub}>Thanks for helping keep the community clean.</div>
                </div>
              ) : showReportSuccess ? (
                <div className={styles.modalState}>
                  <div className={styles.modalTitle}>Report submitted</div>
                  <div className={styles.modalSub}>We’ll review it.</div>
                </div>
              ) : (
                <>
                  <div className={styles.modalHeader}>
                    <div>
                      <div className={styles.modalTitle}>Report profile</div>
                      <div className={styles.modalSub}>
                        You’re reporting <b>@{profile.username}</b>
                      </div>
                    </div>
                    <button className={styles.modalX} type="button" onClick={() => setShowReportModal(false)}>
                      ×
                    </button>
                  </div>

                  <div className={styles.reportOptions}>
                    {[
                      "Inappropriate profile picture",
                      "Inappropriate name or username",
                      "Inappropriate description/bio",
                      "Spam or fake profile",
                      "Harassment or bullying",
                    ].map((label) => (
                      <label key={label} className={styles.reportOption}>
                        <input
                          type="radio"
                          name="reportReason"
                          value={label}
                          checked={reportReasons === label}
                          onChange={(e) => setReportReasons(e.target.value)}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>

                  <div className={styles.reportDetails}>
                    <div className={styles.reportLabel}>Optional details</div>
                    <textarea
                      className={styles.textarea}
                      placeholder="Share more info (optional)"
                      onChange={(e) => (reportDetailsRef.current = e.target.value)}
                    />
                  </div>

                  <div className={styles.modalButtons}>
                    <button className={styles.cancelBtn} type="button" onClick={() => setShowReportModal(false)}>
                      Cancel
                    </button>
                    <button className={styles.primaryBtn} type="button" disabled={!reportReasons} onClick={submitReport}>
                      Submit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -----------------------
   Small UI pieces
----------------------- */

function Pagination({ page, pages, onPrev, onNext, onPick }) {
  // Keep it clean: show up to 7 page buttons
  const nums = [];
  const start = Math.max(1, page - 3);
  const end = Math.min(pages, start + 6);
  for (let p = start; p <= end; p++) nums.push(p);

  return (
    <div className={styles.pagination}>
      <button className={styles.pageBtn} onClick={onPrev} disabled={page <= 1} type="button">
        ‹
      </button>

      {nums.map((p) => (
        <button
          key={p}
          className={`${styles.pageBtn} ${p === page ? styles.pageActive : ""}`}
          onClick={() => onPick(p)}
          type="button"
        >
          {p}
        </button>
      ))}

      <button className={styles.pageBtn} onClick={onNext} disabled={page >= pages} type="button">
        ›
      </button>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className={styles.skeletonWrap}>
      <div className={styles.skeletonHero}>
        <div className={`${styles.skelCircle} ${styles.skel}`} />
        <div className={styles.skelCol}>
          <div className={`${styles.skelLineLg} ${styles.skel}`} />
          <div className={`${styles.skelLineMd} ${styles.skel}`} />
          <div className={`${styles.skelLineSm} ${styles.skel}`} />
        </div>
      </div>

      <div className={styles.skeletonCard}>
        <div className={`${styles.skelLineMd} ${styles.skel}`} />
        <div className={styles.skelGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skelCardMini}>
              <div className={`${styles.skelThumb} ${styles.skel}`} />
              <div className={`${styles.skelLineSm} ${styles.skel}`} />
              <div className={`${styles.skelLineXs} ${styles.skel}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardsSkeleton() {
  return (
    <div className={styles.gridCards}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.mapCard}>
          <div className={`${styles.skelThumb} ${styles.skel}`} />
          <div className={styles.mapBody}>
            <div className={`${styles.skelLineSm} ${styles.skel}`} />
            <div className={`${styles.skelLineXs} ${styles.skel}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
