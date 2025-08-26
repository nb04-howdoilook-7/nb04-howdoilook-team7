const logError = async (response: Response) => {
  if (!response.ok) {
    // .json()은 한 번만 호출할 수 있으므로, 응답을 복제(clone)하여 사용해야
    // 에러 로그와 실제 호출부 양쪽에서 모두 응답 본문을 안전하게 읽을 수 있습니다.
    const data = await response.clone().json();
    console.error(`[프론트] ${response.url} ${response.status}`, data);
  }
};

const enhancedFetch: (
  url: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1] & { next?: { tags: string[] } }
) => ReturnType<typeof fetch> = async (url, init) => {
  let token: string | null = null;

  if (typeof window === 'undefined') {
    // 서버 환경: 쿠키에서 토큰 가져오기
    // 'next/headers'는 서버 전용 모듈이므로, 동적으로 import 합니다.
    const { cookies } = await import('next/headers');
    token = cookies().get('accessToken')?.value || null;
  } else {
    // 클라이언트 환경: localStorage에서 토큰 가져오기
    token = localStorage.getItem('accessToken');
  }

  const headers = new Headers(init?.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // FormData가 아닐 경우에만 Content-Type을 application/json으로 설정
  if (!(init?.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const newInit = { ...init, headers };

  let response: Response;
  try {
    response = await fetch(url, newInit);
    if (response.status === 401) {
      // 401 오류 발생 시 커스텀 이벤트 트리거
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    if (!response.ok) {
      await logError(response);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  return response;
};

export default enhancedFetch;