import type { UserType } from "@/types";
import { defineStore } from "pinia";
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

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentUser: null as UserType | null,
    authReady: false,
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
          console.log("Document data:", this.currentUser);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error logging in user:", error);
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
          location: "",
        };

        await setDoc(doc(db, "users", data.id), data);
        this.currentUser = data as UserType;
      } catch (error) {
        console.error("Error registering user:", error);
        throw error;
      }
    },

    async logout() {
      try {
        await signOut(auth);
        this.currentUser = null;
      } catch (error) {
        console.error("Error logging out user:", error);
        throw error;
      }
    },
    async forgotPassword() {},
  },

  persist: true,
});
