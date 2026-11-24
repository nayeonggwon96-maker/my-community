import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { useAuth } from '../../hooks/use-auth';

/**
 * AuthNotice 컴포넌트
 * 이메일 인증 결과 등 인증 관련 안내를 화면 상단에 잠시 보여준다.
 * 로그인이 필요한 안내라면 로그인 페이지로 이동한다.
 *
 * Example usage:
 * <AuthNotice />
 */
function AuthNotice() {
  const { authNotice, clearAuthNotice } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authNotice?.shouldGoLogin) {
      navigate('/login', { replace: true });
    }
  }, [authNotice, navigate]);

  return (
    <Snackbar
      open={ Boolean(authNotice) }
      autoHideDuration={ 6000 }
      onClose={ clearAuthNotice }
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={ authNotice?.severity ?? 'info' } onClose={ clearAuthNotice } variant="filled" sx={{ width: '100%' }}>
        { authNotice?.message }
      </Alert>
    </Snackbar>
  );
}

export default AuthNotice;
