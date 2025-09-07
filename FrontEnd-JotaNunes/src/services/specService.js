export const getSpecsByLevel = async (spec = 'ambiente') => {
  const response = await fetch(`/mock/specs/${spec}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Falha ao buscar dados: ${spec}`);
  }
  return data.specs;
};