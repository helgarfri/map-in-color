/**
 * Open Paddle checkout for Pro subscription.
 * Loads Paddle.js if needed, fetches config from API, initializes once, opens overlay checkout
 * with custom_data.user_id so the webhook can update the user's plan.
 *
 * @param {number} userId - Our user id (for webhook custom_data)
 * @param {string} [customerEmail] - Optional; prefill checkout email
 * @param {() => void} [onProfileRefresh] - Called after checkout completes so UI can refetch profile
 */

const PADDLE_SCRIPT_URL = 'https://cdn.paddle.com/paddle/v2/paddle.js';
let paddleInitialized = false;
let initPromise = null;
let lastOnComplete = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Initialize Paddle once with client token and default overlay settings.
 */
async function ensurePaddleInitialized(clientToken) {
  if (paddleInitialized && window.Paddle) {
    return window.Paddle;
  }
  if (initPromise) return initPromise;
  initPromise = (async () => {
    await loadScript(PADDLE_SCRIPT_URL);
    if (!window.Paddle) throw new Error('Paddle.js did not load');
    window.Paddle.Initialize({
      token: clientToken,
      checkout: {
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
          successUrl: typeof window !== 'undefined' ? `${window.location.origin}/dashboard?show_pro_thank_you=1` : undefined,
        },
      },
      eventCallback: (data) => {
        if (data?.name === 'checkout.completed') {
          try {
            sessionStorage.setItem('pro_just_subscribed', '1');
          } catch (_) {}
          if (typeof lastOnComplete === 'function') {
            try {
              lastOnComplete();
            } catch (_) {}
          }
        }
        if (data?.name === 'checkout.error') {
          console.error('Paddle checkout.error:', data);
        }
      },
    });
    paddleInitialized = true;
    return window.Paddle;
  })();
  return initPromise;
}

export async function openProCheckout(userId, customerEmail, onProfileRefresh) {
  const { getPaddleConfig } = await import('../api');
  let config;
  try {
    const res = await getPaddleConfig();
    config = res.data;
  } catch (err) {
    if (err?.response?.status === 503 && err?.response?.data?.code === 'PADDLE_NOT_CONFIGURED') {
      return { opened: false, reason: 'not_configured' };
    }
    throw err;
  }
  const { clientToken, priceId } = config;
  if (!clientToken || !priceId) return { opened: false, reason: 'not_configured' };

  lastOnComplete = typeof onProfileRefresh === 'function' ? onProfileRefresh : null;
  const Paddle = await ensurePaddleInitialized(clientToken);

  const options = {
    items: [{ priceId, quantity: 1 }],
    customData: userId != null ? { user_id: userId } : undefined,
    customer: customerEmail ? { email: customerEmail } : undefined,
  };

  Paddle.Checkout.open(options);
  return { opened: true };
}
