test('I shoud know as the main assumptions of the jest', () => {
  let number = null
  expect(number).toBeNull()
  number = 10
  expect(number).not.toBeNull()
  expect(number).toBe(10)
  expect(number).toEqual(10)
  expect(number).toBeGreaterThan(9)
  expect(number).toBeLessThan(11)
})


test('I must know how to work with objects', () => {
  const obj = {name: 'test name', mail: 'test@mail.com'}
  expect(obj).toHaveProperty('name')
  expect(obj).toHaveProperty('name', 'test name')
  expect(obj.name).toBe('test name')

  const obj2 = {name: 'test name', mail: 'test@mail.com'}
  expect(obj).toEqual(obj2)

})
