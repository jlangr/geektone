export const transportTime = totalSixteenths => {
  const measures = Math.floor(totalSixteenths / 16)
  const measureSixteenths = totalSixteenths % 16
  const quarters = Math.floor(measureSixteenths / 4)
  const sixteenths = totalSixteenths % 4
  return `${measures}:${quarters}:${sixteenths}`
}

export const toSixteenths = transportTime => {
  const parts = transportTime.split(':')
  const [bars, quarters, sixteenths] = parts.map(s => parseInt(s, 10))
  return (bars * 16) + (quarters * 4) + sixteenths
}