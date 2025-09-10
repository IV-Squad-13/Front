export const getAllUsers = async () => {
  const response = await fetch('/mock/users');

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Falha ao buscar os usuários');
  }

  return data.users;
};