export function generateRandomNumber () {
  return Math.floor(Math.random() * 1000)
}

export default function generateId () {
  return `${generateRandomNumber()}-${generateRandomNumber()}`
}
