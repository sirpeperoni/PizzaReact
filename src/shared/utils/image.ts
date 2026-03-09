interface imageInterface {
  r?: number;
  x?: number;
  id?: string;
}

export const ImageWithDimensionsIndicated = ({ r, x, id }: imageInterface): string => {
  const link = `https://media.dodostatic.net/image/r:${r}x${x}/${id}`;
  return link;
};
