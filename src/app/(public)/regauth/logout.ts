export async function logoutAndGoHome() {
  try {
    await fetch("/api/regauth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    // even if it fails, still force logout client-side
  }

  // Clear any leftover localStorage (important cleanup)
  try {
    localStorage.removeItem("everleap.user.profile");
    localStorage.removeItem("everleapOnboarding_v4_convo_min");
    localStorage.removeItem("everleap.explore.work.reactions.v1");
    localStorage.removeItem("everleap.explore.learning.reactions.v1");
  } catch {}

  // Hard redirect (do NOT use router)
  window.location.href = "/";
}