import { useCallback, useEffect, useMemo, useState } from 'react';

import { AuthContext } from '../../hooks/auth-context';
import { supabase } from '../../lib/supabase';

/**
 * AuthProvider 컴포넌트
 * Supabase Auth 세션과 users 테이블 프로필을 하위 컴포넌트에 제공한다.
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
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadProfile(data.session?.user);
      setIsLoading(false);
    });

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
        emailRedirectTo: window.location.origin + import.meta.env.BASE_URL,
      },
    });
    if (error) {
      throw error;
    }
    return data;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ session, profile, isLoading, signIn, signUp, signOut }),
    [session, profile, isLoading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={ value }>{ children }</AuthContext.Provider>;
}

export default AuthProvider;
