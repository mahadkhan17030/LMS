import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, User} from "firebase/auth";
import app from '../config/Firebaseconfig';

const auth = getAuth(app);

export const login = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};


export const signup = async (email: string, password: string): Promise<User> => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error in signup:", error);
    throw error;
  }
};