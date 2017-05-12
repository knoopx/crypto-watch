export function percentChange(before, after) {
  return (after - before) / ((after + before) / 2)
}


export function symbolize(value) {
  if (value > 0) {
    return `+${value}`
  }

  return value
}
