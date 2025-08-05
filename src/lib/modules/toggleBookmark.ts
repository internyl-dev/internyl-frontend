import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/config/firebaseConfig";

export const toggleBookmarkInFirestore = async (
  internshipId: string,
  isBookmarked: boolean
) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("User not logged in");

  const userDocRef = doc(db, "users", user.uid);

  if (isBookmarked) {
    await updateDoc(userDocRef, {
      savedInternships: arrayRemove(internshipId),
    });
  } else {
    await updateDoc(userDocRef, {
      savedInternships: arrayUnion(internshipId),
    });
  }
};