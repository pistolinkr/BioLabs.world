import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { auth, db, storage, googleProvider, githubProvider, microsoftProvider, twitterProvider } from './config';

// ===== 인증 서비스 =====

// 이메일/비밀번호 로그인
export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 이메일/비밀번호 회원가입
export const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // 사용자 프로필 업데이트
    await updateDoc(doc(db, 'users', result.user.uid), {
      displayName,
      email,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      labSettings: {
        theme: 'dark',
        language: 'ko',
        notifications: true
      }
    });
    
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Google 로그인
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // 사용자 정보 저장/업데이트
    await saveUserData(result.user, 'google');
    
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// GitHub 로그인
export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    
    // 사용자 정보 저장/업데이트
    await saveUserData(result.user, 'github');
    
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Microsoft 로그인
export const signInWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    
    // 사용자 정보 저장/업데이트
    await saveUserData(result.user, 'microsoft');
    
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Twitter 로그인
export const signInWithTwitter = async () => {
  try {
    const result = await signInWithPopup(auth, twitterProvider);
    
    // 사용자 정보 저장/업데이트
    await saveUserData(result.user, 'twitter');
    
    return { success: true, user: result.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 사용자 데이터 저장/업데이트
const saveUserData = async (user: User, provider: string) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // 새 사용자 생성
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL,
      provider,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      labSettings: {
        theme: 'dark',
        language: 'ko',
        notifications: true
      },
      labData: {
        proteinSimulations: [],
        diagnosisResults: [],
        interactionNetworks: [],
        drugScreenings: [],
        epidemiologyModels: []
      }
    });
  } else {
    // 기존 사용자 로그인 시간 업데이트
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
      photoURL: user.photoURL,
      displayName: user.displayName || userSnap.data().displayName
    });
  }
};

// 로그아웃
export const signOutUser = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 인증 상태 변경 감지
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ===== 사용자 Lab 데이터 관리 =====

// 사용자 Lab 설정 가져오기
export const getUserLabSettings = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data().labSettings };
    }
    return { success: false, error: 'User not found' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 사용자 Lab 설정 업데이트
export const updateUserLabSettings = async (userId: string, settings: any) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      labSettings: settings
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 사용자 Lab 데이터 가져오기
export const getUserLabData = async (userId: string, dataType: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const labData = userDoc.data().labData;
      return { success: true, data: labData[dataType] || [] };
    }
    return { success: false, error: 'User not found' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 사용자 Lab 데이터 저장
export const saveUserLabData = async (userId: string, dataType: string, data: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentData = userDoc.data().labData[dataType] || [];
      const newData = [...currentData, { ...data, id: Date.now(), createdAt: serverTimestamp() }];
      
      await updateDoc(userRef, {
        [`labData.${dataType}`]: newData
      });
      
      return { success: true, data: newData };
    }
    
    return { success: false, error: 'User not found' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 사용자 Lab 데이터 업데이트
export const updateUserLabData = async (userId: string, dataType: string, dataId: number, updates: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentData = userDoc.data().labData[dataType] || [];
      const updatedData = currentData.map((item: any) => 
        item.id === dataId ? { ...item, ...updates, updatedAt: serverTimestamp() } : item
      );
      
      await updateDoc(userRef, {
        [`labData.${dataType}`]: updatedData
      });
      
      return { success: true, data: updatedData };
    }
    
    return { success: false, error: 'User not found' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 사용자 Lab 데이터 삭제
export const deleteUserLabData = async (userId: string, dataType: string, dataId: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentData = userDoc.data().labData[dataType] || [];
      const filteredData = currentData.filter((item: any) => item.id !== dataId);
      
      await updateDoc(userRef, {
        [`labData.${dataType}`]: filteredData
      });
      
      return { success: true, data: filteredData };
    }
    
    return { success: false, error: 'User not found' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ===== 기존 Firestore 서비스 =====

// 모든 문서 가져오기
export const getAllDocuments = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: documents };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 특정 문서 가져오기
export const getDocument = async (collectionName: string, documentId: string) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, documentId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Document not found' };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 새 문서 추가
export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 문서 업데이트
export const updateDocument = async (collectionName: string, documentId: string, data: any) => {
  try {
    await updateDoc(doc(db, collectionName, documentId), {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 문서 삭제
export const deleteDocument = async (collectionName: string, documentId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 문서 쿼리
export const queryDocuments = async (collectionName: string, conditions: any[] = []) => {
  try {
    let q: any = collection(db, collectionName);
    
    // 조건 적용
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Record<string, any>)
    }));
    
    return { success: true, data: documents };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ===== Storage 서비스 =====

// 파일 업로드
export const uploadFile = async (path: string, file: File) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 파일 URL 가져오기
export const getFileURL = async (path: string) => {
  try {
    const url = await getDownloadURL(ref(storage, path));
    return { success: true, url };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 파일 삭제
export const deleteFile = async (path: string) => {
  try {
    await deleteObject(ref(storage, path));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ===== BioLabs 특화 서비스 =====

// 사용자별 Protein Simulation 데이터 저장
export const saveProteinSimulation = async (userId: string, simulationData: any) => {
  return await saveUserLabData(userId, 'proteinSimulations', simulationData);
};

// 사용자별 Diagnosis AI 결과 저장
export const saveDiagnosisResult = async (userId: string, diagnosisData: any) => {
  return await saveUserLabData(userId, 'diagnosisResults', diagnosisData);
};

// 사용자별 Interaction Network 저장
export const saveInteractionNetwork = async (userId: string, networkData: any) => {
  return await saveUserLabData(userId, 'interactionNetworks', networkData);
};

// 사용자별 Drug Screening 결과 저장
export const saveDrugScreening = async (userId: string, screeningData: any) => {
  return await saveUserLabData(userId, 'drugScreenings', screeningData);
};

// 사용자별 Epidemiology Model 저장
export const saveEpidemiologyModel = async (userId: string, modelData: any) => {
  return await saveUserLabData(userId, 'epidemiologyModels', modelData);
};
