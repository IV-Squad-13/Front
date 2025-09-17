export const loginUser = async (email, password) => {
  const response = await fetch('/mock/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Falha no login');
  }
  return data.user;
};
