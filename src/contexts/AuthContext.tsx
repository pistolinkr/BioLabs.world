import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  signIn, 
  signUp, 
  signOutUser, 
  onAuthChange,
  signInWithGoogle,
  signInWithGithub,
  getUserLabSettings,
  updateUserLabSettings,
  getUserLabData,
  saveUserLabData,
  updateUserLabData,
  deleteUserLabData
} from '../firebase/services';

// 사용자 Lab 데이터 타입 정의
export interface LabData {
  proteinSimulations: any[];
  diagnosisResults: any[];
  interactionNetworks: any[];
  drugScreenings: any[];
  epidemiologyModels: any[];
}

export interface LabSettings {
  theme: 'dark' | 'light';
  language: 'ko' | 'en';
  notifications: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: string;
  createdAt: any;
  lastLoginAt: any;
  labSettings: LabSettings;
  labData: LabData;
}

// AuthContext 타입 정의
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; user?: User; error?: string }>;
  signInWithGithub: () => Promise<{ success: boolean; user?: User; error?: string }>;
  signUpWithSocial: (socialUser: any, displayName: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  updateLabSettings: (settings: Partial<LabSettings>) => Promise<{ success: boolean; error?: string }>;
  getLabData: (dataType: keyof LabData) => Promise<{ success: boolean; data?: any; error?: string }>;
  saveLabData: (dataType: keyof LabData, data: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  updateLabData: (dataType: keyof LabData, dataId: number, updates: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  deleteLabData: (dataType: keyof LabData, dataId: number) => Promise<{ success: boolean; data?: any; error?: string }>;
}

// AuthContext 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 컴포넌트
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 프로필 로드
  const loadUserProfile = async (user: User) => {
    try {
      const settingsResult = await getUserLabSettings(user.uid);
      if (settingsResult.success) {
        // Firestore에서 사용자 프로필 데이터 직접 가져오기
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: userData.provider || 'email',
            createdAt: userData.createdAt || new Date(),
            lastLoginAt: userData.lastLoginAt || new Date(),
            labSettings: settingsResult.data,
            labData: userData.labData || {
              proteinSimulations: [],
              diagnosisResults: [],
              interactionNetworks: [],
              drugScreenings: [],
              epidemiologyModels: []
            }
          });
        } else {
          // 사용자 문서가 없으면 기본 프로필 생성
          setUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            provider: 'email',
            createdAt: new Date(),
            lastLoginAt: new Date(),
            labSettings: settingsResult.data,
            labData: {
              proteinSimulations: [],
              diagnosisResults: [],
              interactionNetworks: [],
              drugScreenings: [],
              epidemiologyModels: []
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  // 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      if (user) {
        loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 이메일/비밀번호 로그인
  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.success && result.user) {
      await loadUserProfile(result.user);
    }
    return result;
  };

  // 이메일/비밀번호 회원가입
  const handleSignUp = async (email: string, password: string, displayName: string) => {
    const result = await signUp(email, password, displayName);
    if (result.success && result.user) {
      await loadUserProfile(result.user);
    }
    return result;
  };

  // Google 로그인
  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success && result.user) {
      await loadUserProfile(result.user);
    }
    return result;
  };

  // GitHub 로그인
  const handleGithubSignIn = async () => {
    const result = await signInWithGithub();
    if (result.success && result.user) {
      await loadUserProfile(result.user);
    }
    return result;
  };

  // 로그아웃
  const handleSignOut = async () => {
    const result = await signOutUser();
    if (result.success) {
      setUserProfile(null);
    }
    return result;
  };

  // Lab 설정 업데이트
  const updateLabSettings = async (settings: Partial<LabSettings>) => {
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await updateUserLabSettings(currentUser.uid, settings);
      if (result.success && userProfile) {
        setUserProfile({
          ...userProfile,
          labSettings: { ...userProfile.labSettings, ...settings }
        });
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Lab 데이터 가져오기
  const getLabData = async (dataType: keyof LabData) => {
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    return await getUserLabData(currentUser.uid, dataType);
  };

  // Lab 데이터 저장
  const saveLabData = async (dataType: keyof LabData, data: any) => {
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await saveUserLabData(currentUser.uid, dataType, data);
      if (result.success && userProfile) {
        setUserProfile({
          ...userProfile,
          labData: {
            ...userProfile.labData,
            [dataType]: result.data
          }
        });
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Lab 데이터 업데이트
  const updateLabData = async (dataType: keyof LabData, dataId: number, updates: any) => {
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await updateUserLabData(currentUser.uid, dataType, dataId, updates);
      if (result.success && userProfile) {
        setUserProfile({
          ...userProfile,
          labData: {
            ...userProfile.labData,
            [dataType]: result.data
          }
        });
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // Lab 데이터 삭제
  const deleteLabData = async (dataType: keyof LabData, dataId: number) => {
    if (!currentUser) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const result = await deleteUserLabData(currentUser.uid, dataType, dataId);
      if (result.success && userProfile) {
        setUserProfile({
          ...userProfile,
          labData: {
            ...userProfile.labData,
            [dataType]: result.data
          }
        });
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  // 소셜 계정으로 가입 (임시 구현)
  const signUpWithSocial = async (socialUser: any, displayName: string, password: string) => {
    try {
      // 임시로 성공 반환 (실제 구현은 나중에)
      return { success: true, user: socialUser, error: undefined };
    } catch (error: any) {
      return { success: false, user: undefined, error: error.message };
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleGoogleSignIn,
    signInWithGithub: handleGithubSignIn,
    signUpWithSocial,
    updateLabSettings,
    getLabData,
    saveLabData,
    updateLabData,
    deleteLabData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
