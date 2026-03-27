const BASE_URL = 'http://localhost:2310/api';

const getToken = () => localStorage.getItem('aidToken');

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    // If backend sent an error message, throw it so we can show it to the user
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {

  // Public POST (no token needed — register, login)
  post: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  // Protected POST (token required — save profile, save assessment)
  authPost: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(body)
    });
    return handleResponse(res);
  },

  // Protected GET (token required — get profile, get history)
  authGet: async (path) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return handleResponse(res);
  }
};

// Helper: is there a token in localStorage?
export const isLoggedIn = () => !!localStorage.getItem('aidToken');

// Helper: save everything after login/register
export const saveSession = (data) => {
    localStorage.setItem('aidToken', data.token);
    localStorage.setItem('aidUserId', data._id);
    localStorage.setItem('aidProfileComplete', data.profileComplete);
    if (data.name) localStorage.setItem('aidUserName', data.name);
    if (data.email) localStorage.setItem("aidUserEmail", data.email);
  };

// Helper: clear everything on logout
export const clearSession = () => {
  localStorage.removeItem('aidToken');
  localStorage.removeItem('aidUserId');
  localStorage.removeItem('aidProfileComplete');
};

export const profileIsComplete = () =>
  localStorage.getItem('aidProfileComplete') === 'true';