export const getAllAmbientes = async () => {
  const response = await fetch('/mock/specs/ambiente');

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Falha ao buscar os ambientes');
  }
  return data.specs;
};

