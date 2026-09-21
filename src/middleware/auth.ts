import { auth, onAuthStateChanged } from "@/service/firebase";
let authChecked = false;

function getCurrentUser() {
  if (authChecked) {
    return Promise.resolve(auth.currentUser);
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      authChecked = true;
      unsubscribe();
      resolve(user);
    });
  });
}
export async function authMiddleware(to: any) {
  const user = await getCurrentUser();

  if (to.meta.requiresAuth && !user) {
    return "/login";
  }

  if (to.meta.guestOnly && user) {
    return "/overview";
  }

  return true;
}
