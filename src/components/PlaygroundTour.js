import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import {
  hasCompletedPlaygroundTour,
  markPlaygroundTourCompleted,
} from "../utils/playgroundTourStorage";
import styles from "./PlaygroundTour.module.css";

const TOUR_STEPS = [
  {
    element: '[data-tour="map-type"]',
    popover: {
      title: "Choose your map",
      description:
        "Switch between World, continents, Europe, or US States — pick the canvas for your data.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="region-picker"]',
    popover: {
      title: "Select countries or states",
      description:
        "Click the count to customize which regions appear on the map.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="map-mode"]',
    popover: {
      title: "Choropleth or categorical",
      description:
        "Choropleth colors by numeric ranges. Categorical groups regions into named categories.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="data-entries"]',
    popover: {
      title: "Add your data",
      description:
        "Upload a spreadsheet or type values directly for each country or state in the list.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="map-preview"]',
    popover: {
      title: "Explore the map",
      description:
        "Click any region on the preview to see its value and details.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="ranges"]',
    popover: {
      title: "Ranges and colors",
      description:
        "Set breakpoints, generate ranges from your data, and pick a color palette for the legend.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="map-info"]',
    popover: {
      title: "Map info",
      description:
        "Add a title, description, visibility, tags, and references so others understand your map.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="save"]',
    popover: {
      title: "Save your map",
      description:
        "Create an account to save this map, edit it later, and share it with the world.",
      side: "top",
      align: "end",
    },
  },
];

/**
 * Guest playground spotlight tour (driver.js).
 * Auto-starts once; re-run when startNonce increments (Take tour).
 */
export default function PlaygroundTour({
  enabled = false,
  blocked = false,
  startNonce = 0,
  onRequestSignup,
}) {
  const driverRef = useRef(null);
  const openSignupOnDestroyRef = useRef(false);
  const persistCompletedRef = useRef(false);
  const startedForNonceRef = useRef(null);
  const autoStartedRef = useRef(false);
  const onRequestSignupRef = useRef(onRequestSignup);
  const blockedRef = useRef(blocked);
  onRequestSignupRef.current = onRequestSignup;
  blockedRef.current = blocked;

  const destroyTour = () => {
    const d = driverRef.current;
    if (d) {
      driverRef.current = null;
      d.destroy();
    }
  };

  const finishAsSkipped = (drv) => {
    persistCompletedRef.current = true;
    openSignupOnDestroyRef.current = false;
    drv.destroy();
  };

  const finishAsDone = (drv) => {
    persistCompletedRef.current = true;
    openSignupOnDestroyRef.current = true;
    drv.destroy();
  };

  const startTour = () => {
    if (!enabled || blockedRef.current) return;
    if (typeof window !== "undefined" && window.innerWidth < 1025) return;

    destroyTour();
    openSignupOnDestroyRef.current = false;
    persistCompletedRef.current = false;

    const d = driver({
      overlayColor: "#0b1220",
      overlayOpacity: 0.55,
      stagePadding: 8,
      stageRadius: 12,
      allowClose: true,
      smoothScroll: true,
      animate: true,
      showProgress: true,
      progressText: "{{current}} of {{total}}",
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      popoverClass: styles.tourPopover,
      showButtons: ["previous", "next", "close"],
      steps: TOUR_STEPS,
      onPopoverRender: (popover) => {
        if (popover.closeButton) {
          popover.closeButton.innerText = "Skip";
          popover.closeButton.setAttribute("aria-label", "Skip tour");
          if (popover.footerButtons && !popover.footerButtons.contains(popover.closeButton)) {
            popover.footerButtons.prepend(popover.closeButton);
          }
        }
      },
      onCloseClick: (_el, _step, { driver: drv }) => {
        finishAsSkipped(drv);
      },
      onDestroyed: () => {
        driverRef.current = null;
        if (persistCompletedRef.current) {
          markPlaygroundTourCompleted();
        }
        if (openSignupOnDestroyRef.current) {
          openSignupOnDestroyRef.current = false;
          onRequestSignupRef.current?.();
        }
        persistCompletedRef.current = false;
      },
      onNextClick: (_el, _step, { driver: drv }) => {
        if (drv.isLastStep()) {
          finishAsDone(drv);
          return;
        }
        drv.moveNext();
      },
      onDoneClick: (_el, _step, { driver: drv }) => {
        finishAsDone(drv);
      },
      onPrevClick: (_el, _step, { driver: drv }) => {
        drv.movePrevious();
      },
    });

    driverRef.current = d;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (driverRef.current !== d || blockedRef.current) {
          if (driverRef.current === d) {
            destroyTour();
          } else {
            d.destroy();
          }
          return;
        }
        d.drive();
      });
    });
  };

  // Auto-start once for first-time guests
  useEffect(() => {
    if (!enabled || blocked) return;
    if (autoStartedRef.current) return;
    if (hasCompletedPlaygroundTour()) return;

    const t = window.setTimeout(() => {
      autoStartedRef.current = true;
      startTour();
    }, 400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, blocked]);

  // Manual replay via Take tour
  useEffect(() => {
    if (!enabled || blocked) return;
    if (!startNonce) return;
    if (startedForNonceRef.current === startNonce) return;
    startedForNonceRef.current = startNonce;
    const t = window.setTimeout(() => {
      startTour();
    }, 50);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startNonce, enabled, blocked]);

  // Tear down if disabled or blocked mid-tour (do not mark completed)
  useEffect(() => {
    if (!enabled || blocked) {
      openSignupOnDestroyRef.current = false;
      persistCompletedRef.current = false;
      destroyTour();
    }
  }, [enabled, blocked]);

  useEffect(() => {
    return () => {
      openSignupOnDestroyRef.current = false;
      persistCompletedRef.current = false;
      destroyTour();
    };
  }, []);

  return null;
}
