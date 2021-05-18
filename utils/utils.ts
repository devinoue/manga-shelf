export const formatVol = (title: string) => {
  const array = [...title.matchAll(/第(\d+)巻/g)]
  return array[0] ? array[0][0] : ''
}
export const isNumber = (value: unknown) => {
  return typeof value === 'number' && isFinite(value)
}
export const getFormatPath = (originalPath: string) => {
  const value = { page: 0, path: '' }
  const tmp = originalPath.split('/')
  const clean = tmp.filter(Boolean)
  const testCar = Number(clean[clean.length - 1])
  if (isNumber(testCar)) {
    value.page = testCar
    clean.pop()
    value.path = clean.join('/') + '/'
  } else {
    value.page = 0
    value.path = clean.join('/') + '/'
  }
  return value
}
