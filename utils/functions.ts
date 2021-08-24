export default function timeout (ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
