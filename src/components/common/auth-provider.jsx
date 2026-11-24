import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AuthContext } from '../../hooks/auth-context';
import { supabase } from '../../lib/supabase';
import { consumeAuthRedirect } from '../../utils/consume-auth-redirect';

/** 화면을 그리기 전에 인증 메일 링크 정보를 읽어 주소창을 정리한다 */
const initialAuthRedirect = consumeAuthRedirect();

const getRedirectUrl = () => window.location.origin + import.meta.env.BASE_URL;

/**
 * AuthProvider 컴포넌트
 * Supabase Auth 세션과 users 테이블 프로필을 하위 컴포넌트에 제공한다.
 * 인증 메일 링크(?code=)로 돌아오면 세션으로 교환하고 안내 메시지를 만든다.
 *
 * Props:
 * @param {node} children - 하위 컴포넌트 [Required]
 *
 * Example usage:
 * <AuthProvider><App /></AuthProvider>
 */
function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authNotice, setAuthNotice] = useState(null);
  const hasHandledRedirect = useRef(false);

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUser.id)
      .maybeSingle();
    setProfile(data);
  }, []);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      /** StrictMode 에서 effect 가 두 번 실행돼도 코드는 한 번만 교환한다 */
      if (!initialAuthRedirect || hasHandledRedirect.current) {
        return;
      }
      hasHandledRedirect.current = true;

      if (initialAuthRedirect.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(initialAuthRedirect.code);
        setAuthNotice(error
          /** 다른 브라우저에서 링크를 연 경우: 인증은 완료됐지만 자동 로그인은 불가 */
          ? { severity: 'success', message: '이메일 인증이 완료됐어요! 로그인해주세요. 🐾', shouldGoLogin: true }
          : { severity: 'success', message: '이메일 인증 완료! 포우포우에 오신 걸 환영해요 🐶' });
        return;
      }

      setAuthNotice({
        severity: 'error',
        message: initialAuthRedirect.errorCode === 'otp_expired'
          ? '인증 링크가 만료되었어요. 로그인 화면에서 인증 메일을 다시 받아주세요.'
          : '인증 링크가 올바르지 않아요. 로그인 화면에서 인증 메일을 다시 받아주세요.',
        shouldGoLogin: true,
      });
    };

    const init = async () => {
      await handleAuthRedirect();
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      await loadProfile(data.session?.user);
      setIsLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      /** onAuthStateChange 콜백 안에서 바로 await 하면 교착될 수 있어 다음 틱으로 미룬다 */
      setTimeout(() => loadProfile(nextSession?.user), 0);
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  }, []);

  const signUp = useCallback(async ({ email, password, name, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
        emailRedirectTo: getRedirectUrl(),
      },
    });
    if (error) {
      throw error;
    }
    return data;
  }, []);

  const resendConfirmation = useCallback(async (email) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: getRedirectUrl() },
    });
    if (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const clearAuthNotice = useCallback(() => setAuthNotice(null), []);

  const value = useMemo(
    () => ({ session, profile, isLoading, authNotice, signIn, signUp, resendConfirmation, signOut, clearAuthNotice }),
    [session, profile, isLoading, authNotice, signIn, signUp, resendConfirmation, signOut, clearAuthNotice],
  );

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export default AuthProvider;
