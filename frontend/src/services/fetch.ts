const logError = async (response: Response) => {
  if (!response.ok) {
    const data = await response.json();
    console.error(`[프론트] ${response.url} ${response.status}`, data);
  }
};

const enhancedFetch: (
  url: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1] & { next?: { tags: string[] } }
) => ReturnType<typeof fetch> = async (url, init) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
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
    if (!response.ok) {
      await logError(response);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  return response;
};

export default enhancedFetch;
