const AUTH_PARAMS = ['code', 'error', 'error_code', 'error_description'];

/**
 * 인증 메일 링크로 돌아왔을 때 URL 의 인증 정보를 읽고, 주소창에서 지운다.
 * HashRouter 가 화면을 그리기 전에 호출해야 # 경로가 깨지지 않는다.
 * @returns {{ code: string|null, errorCode: string|null } | null} 인증 정보 (없으면 null)
 */
export function consumeAuthRedirect() {
  const url = new URL(window.location.href);
  const hashParams = new URLSearchParams(url.hash.startsWith('#error') ? url.hash.slice(1) : '');
  const code = url.searchParams.get('code');
  const errorCode = url.searchParams.get('error_code') ?? url.searchParams.get('error')
    ?? hashParams.get('error_code') ?? hashParams.get('error');

  if (!code && !errorCode) {
    return null;
  }

  AUTH_PARAMS.forEach((key) => url.searchParams.delete(key));
  if (hashParams.size > 0) {
    url.hash = '';
  }
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);

  return { code, errorCode };
}
