import { FirebaseError } from "firebase/app";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

const USERNAME_TO_EMAIL: Record<string, string> = {
  islam: "islam@islamalbadawy.com",
};

export async function loginAdmin(
  username: string,
  password: string
): Promise<void> {
  const email = USERNAME_TO_EMAIL[username.toLowerCase()];
  if (!email) {
    throw new Error("Invalid username or password.");
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    if (
      err instanceof FirebaseError &&
      err.code === "auth/too-many-requests"
    ) {
      throw new Error("Too many failed attempts. Please try again later.");
    }
    throw new Error("Invalid username or password.");
  }
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export function listenToAuthChanges(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}
