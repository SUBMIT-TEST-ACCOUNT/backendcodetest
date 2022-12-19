export function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * max);
}

export function getRandomNumberArray(max: number): Array<number> {
  const result = [];

  while (result.length < Number(process.env.ROUTE_VALUE)) {
    const randomNumber = getRandomNumber(max);

    if (result.includes(randomNumber)) {
      continue;
    }

    result.push(randomNumber);
  }

  return result;
}
