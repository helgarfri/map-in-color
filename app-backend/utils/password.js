/**
 * Shared password rule checks (signup + change-password).
 * Returns array of failure messages; empty array means valid.
 */
function passwordRuleFailures(pw) {
  const fails = [];
  if (!pw || pw.length < 6) fails.push('at least 6 characters');
  if (!/[A-Z]/.test(pw)) fails.push('one uppercase letter (A-Z)');
  if (!/[0-9]/.test(pw)) fails.push('one number (0-9)');
  if (!/[!?.#]/.test(pw)) fails.push('one special character (! ? . #)');
  return fails;
}

module.exports = { passwordRuleFailures };
