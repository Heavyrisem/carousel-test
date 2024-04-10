export function getLoopNumber(start: number, end: number, target: number) {
  // ai가 만든거임 묻지마
  const loopNumber = (target - start) % (end - start);
  return loopNumber < 0 ? loopNumber + (end - start) : loopNumber;
}
