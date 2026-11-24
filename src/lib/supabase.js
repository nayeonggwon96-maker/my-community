import { createClient } from '@supabase/supabase-js';

/**
 * PKCE 방식을 사용해 인증 메일 링크가 ?code= 형태로 돌아오게 한다.
 * (HashRouter 의 # 경로와 충돌하지 않도록)
 * 인증 코드 교환은 AuthProvider 에서 직접 처리한다.
 */
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: false,
    },
  },
);
