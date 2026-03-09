import { auth } from '../firebase';

export const checkFirebaseRole = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const idTokenResult = await user.getIdTokenResult(true);
      const role = idTokenResult.claims.role as string;
      return role || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
