import { useContext } from 'react';

import { AuthContext } from './auth-context';

/**
 * 로그인 상태와 인증 함수를 반환하는 훅
 * @returns {{ session: object, profile: object, isLoading: boolean, signIn: function, signUp: function, signOut: function }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 는 AuthProvider 안에서 사용해야 합니다.');
  }
  return context;
}
