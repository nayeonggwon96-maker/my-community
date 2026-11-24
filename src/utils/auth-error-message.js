const MESSAGES = {
  email_not_confirmed: '이메일 인증이 아직 완료되지 않았어요. 메일함(스팸함 포함)에서 인증 메일의 링크를 눌러주세요.',
  invalid_credentials: '아이디 또는 비밀번호를 확인해주세요.',
  user_already_exists: '이미 가입된 이메일이에요. 로그인해주세요.',
  weak_password: '비밀번호가 너무 약해요. 6자 이상으로 입력해주세요.',
  email_address_invalid: '사용할 수 없는 이메일 주소예요.',
  over_email_send_rate_limit: '인증 메일을 너무 자주 요청했어요. 잠시 후 다시 시도해주세요.',
  over_request_rate_limit: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.',
};

/**
 * Supabase Auth 오류를 사용자에게 보여줄 한국어 문구로 바꾼다
 * @param {object} error - Supabase AuthError
 * @param {string} fallback - 알 수 없는 오류일 때 문구
 * @returns {string} 안내 문구
 */
export function getAuthErrorMessage(error, fallback) {
  if (MESSAGES[error?.code]) {
    return MESSAGES[error.code];
  }
  if (/email not confirmed/i.test(error?.message ?? '')) {
    return MESSAGES.email_not_confirmed;
  }
  if (/rate limit/i.test(error?.message ?? '')) {
    return MESSAGES.over_email_send_rate_limit;
  }
  return fallback;
}

/**
 * 이메일 미인증 오류인지 확인한다
 * @param {object} error - Supabase AuthError
 * @returns {boolean} 미인증 여부
 */
export function isEmailNotConfirmed(error) {
  return error?.code === 'email_not_confirmed' || /email not confirmed/i.test(error?.message ?? '');
}
