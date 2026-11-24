import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import PetsRoundedIcon from '@mui/icons-material/PetsRounded';

import { useAuth } from '../hooks/use-auth';
import { getAuthErrorMessage, isEmailNotConfirmed } from '../utils/auth-error-message';

const INITIAL_SIGN_UP = { name: '', email: '', password: '', phone: '' };

/**
 * LoginPage 컴포넌트
 * 로그인 / 회원가입을 탭 메뉴로 보여준다.
 *
 * Example usage:
 * <LoginPage />
 */
function LoginPage() {
  const { signIn, signUp, resendConfirmation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(0);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState(INITIAL_SIGN_UP);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** 인증 메일을 다시 보낼 수 있는 이메일 (가입 직후 또는 미인증 로그인 시) */
  const [pendingEmail, setPendingEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const changeTab = (nextTab) => {
    setTab(nextTab);
    setErrorMessage('');
    setInfoMessage('');
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setInfoMessage('');
    try {
      await signIn(loginForm.email, loginForm.password);
      navigate(location.state?.from ?? '/', { replace: true });
    } catch (error) {
      setPendingEmail(isEmailNotConfirmed(error) ? loginForm.email : '');
      setErrorMessage(getAuthErrorMessage(error, '아이디 또는 비밀번호를 확인해주세요.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setErrorMessage('');
    try {
      await resendConfirmation(pendingEmail);
      setInfoMessage(`${pendingEmail} 로 인증 메일을 다시 보냈어요. 메일함을 확인해주세요. 📮`);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, '인증 메일을 보내지 못했어요. 잠시 후 다시 시도해주세요.'));
    } finally {
      setIsResending(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (signUpForm.password.length < 6) {
      setErrorMessage('비밀번호는 6자 이상 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const result = await signUp(signUpForm);
      /** 이미 가입된 이메일이면 Supabase 는 오류 대신 identities 가 빈 user 를 돌려준다 */
      if (result.user && result.user.identities?.length === 0) {
        setErrorMessage('이미 가입된 이메일이에요. 로그인해주세요.');
        return;
      }
      setSignUpForm(INITIAL_SIGN_UP);
      if (result.session) {
        navigate('/', { replace: true });
        return;
      }
      setLoginForm((prev) => ({ ...prev, email: signUpForm.email }));
      setPendingEmail(signUpForm.email);
      setTab(0);
      setInfoMessage(`회원가입 완료! ${signUpForm.email} 로 보낸 인증 메일의 링크를 누르면 바로 로그인돼요. 🐾`);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 440, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <PetsRoundedIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Box component="h1" sx={{ m: 0, fontFamily: '"Jua", sans-serif', fontWeight: 400, color: 'primary.main', fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1.2 }}>
          포우포우
        </Box>
        <Box sx={{ color: 'text.secondary', fontSize: { xs: '0.9rem', md: '1rem' }, mt: 1 }}>
          반려동물과 함께하는 따뜻한 이야기
        </Box>
      </Box>

      <Paper sx={{ p: { xs: 2, md: 4 } }}>
        <Tabs value={ tab } onChange={ (_event, value) => changeTab(value) } variant="fullWidth" sx={{ mb: 3 }}>
          <Tab label="로그인" />
          <Tab label="회원가입" />
        </Tabs>

        { errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{ errorMessage }</Alert> }
        { infoMessage && <Alert severity="success" sx={{ mb: 2 }}>{ infoMessage }</Alert> }
        { tab === 0 && pendingEmail && (
          <Box sx={{ mb: 2, textAlign: 'center', fontSize: '0.875rem', color: 'text.secondary' }}>
            인증 메일을 못 받으셨나요?{ ' ' }
            <Button size="small" onClick={ handleResend } disabled={ isResending }>
              인증 메일 다시 보내기
            </Button>
          </Box>
        ) }

        { tab === 0 ? (
          <Box component="form" onSubmit={ handleLogin }>
            <Stack spacing={ 2 }>
              <TextField
                label="아이디 (이메일)"
                type="email"
                required
                autoComplete="email"
                value={ loginForm.email }
                onChange={ (event) => setLoginForm((prev) => ({ ...prev, email: event.target.value })) }
              />
              <TextField
                label="비밀번호"
                type="password"
                required
                autoComplete="current-password"
                value={ loginForm.password }
                onChange={ (event) => setLoginForm((prev) => ({ ...prev, password: event.target.value })) }
              />
              <Button type="submit" variant="contained" size="large" disabled={ isSubmitting }>
                로그인하기
              </Button>
            </Stack>
            <Box sx={{ mt: 3, textAlign: 'center', fontSize: '0.9rem', color: 'text.secondary' }}>
              아직 포우포우 회원이 아니신가요?{ ' ' }
              <Box
                component="button"
                type="button"
                onClick={ () => changeTab(1) }
                sx={{ border: 0, bgcolor: 'transparent', color: 'primary.main', fontWeight: 700, cursor: 'pointer', p: 0, fontSize: 'inherit', fontFamily: 'inherit' }}
              >
                회원가입하기 🐶
              </Box>
            </Box>
          </Box>
        ) : (
          <Box component="form" onSubmit={ handleSignUp }>
            <Stack spacing={ 2 }>
              <TextField
                label="이름"
                required
                value={ signUpForm.name }
                onChange={ (event) => setSignUpForm((prev) => ({ ...prev, name: event.target.value })) }
              />
              <TextField
                label="이메일 (아이디)"
                type="email"
                required
                autoComplete="email"
                value={ signUpForm.email }
                onChange={ (event) => setSignUpForm((prev) => ({ ...prev, email: event.target.value })) }
              />
              <TextField
                label="비밀번호 (6자 이상)"
                type="password"
                required
                autoComplete="new-password"
                value={ signUpForm.password }
                onChange={ (event) => setSignUpForm((prev) => ({ ...prev, password: event.target.value })) }
              />
              <TextField
                label="전화번호 (선택)"
                type="tel"
                value={ signUpForm.phone }
                onChange={ (event) => setSignUpForm((prev) => ({ ...prev, phone: event.target.value })) }
              />
              <Button type="submit" variant="contained" size="large" disabled={ isSubmitting }>
                회원가입하기
              </Button>
            </Stack>
          </Box>
        ) }
      </Paper>
    </Box>
  );
}

export default LoginPage;
