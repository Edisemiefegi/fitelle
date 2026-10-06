import type { UserType } from "@/types";
import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
  signInWithEmailAndPassword,
  getDoc,
  signOut,
} from "@/service/firebase";
import type { AuthSchemaType } from "@/schema";
import { usePortfolioStore } from "@/stores/portfolio";

const AUTH_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Choose a stronger password.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
};

function authErrorMessage(error: unknown, fallback: string): string {
  const code = (error as { code?: string })?.code;
  return (code && AUTH_ERRORS[code]) || fallback;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentUser: null as UserType | null,
    authReady: false,
    isSavingProfile: false,
  }),

  actions: {
  
    async loginFunc(user: AuthSchemaType) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          user.email,
          user.password,
        );

        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.currentUser = docSnap.data() as UserType;
          toast.success("Welcome back");
        } else {
          throw new Error("User profile not found");
        }
      } catch (error) {
        console.error("Error logging in user:", error);
        toast.error(authErrorMessage(error, "Couldn't log you in. Try again."));
        throw error;
      }
    },

    async registerUser(user: AuthSchemaType) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password,
        );
        const data = {
          id: userCredential.user.uid,
          email: userCredential.user.email,
          brandName: user.brandName,
          profileImage: "",
          fullName: "",
          phoneNumber: "",
        };

        await setDoc(doc(db, "users", data.id), data);
        this.currentUser = data as UserType;
        toast.success("Account created");
      } catch (error) {
        console.error("Error registering user:", error);
        toast.error(authErrorMessage(error, "Couldn't create your account. Try again."));
        throw error;
      }
    },

    async logout() {
      try {
        await signOut(auth);
        this.currentUser = null;
        usePortfolioStore().$reset();
      } catch (error) {
        console.error("Error logging out user:", error);
        toast.error("Couldn't log you out. Try again.");
        throw error;
      }
    },

    async updateProfile(updates: Partial<UserType>) {
      if (!this.currentUser) throw new Error("Not authenticated");
 
      this.isSavingProfile = true;
      try {
        await setDoc(doc(db, "users", this.currentUser.id), updates, { merge: true });
        this.currentUser = { ...this.currentUser, ...updates };
      } catch (error) {
        console.error("updateProfile error:", error);
        toast.error("Couldn't save your settings.");
        throw error;
      } finally {
        this.isSavingProfile = false;
      }
    },

    async forgotPassword() {},
  },

  persist: true,
});
