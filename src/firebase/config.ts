import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase 설정
// 환경 변수에서 가져오거나 기본값 사용
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDJv0Xtdk3D4hIaBE28H14UP9fntZToKlk",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "prionlab-28116.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "prionlab-28116",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "prionlab-28116.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "531953772834",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:531953772834:web:4c60da8a5495631ea99d7b",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-36PK2HFT36"
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 내보내기
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// OAuth 제공자들 초기화
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// OAuth 제공자별 추가 설정
googleProvider.addScope('email');
googleProvider.addScope('profile');

githubProvider.addScope('user:email');
githubProvider.addScope('read:user');

// Analytics는 브라우저 환경에서만 초기화
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Firebase 앱 인스턴스 내보내기
export default app;

// 환경 변수 확인을 위한 로그 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    storageBucket: firebaseConfig.storageBucket
  });
}
