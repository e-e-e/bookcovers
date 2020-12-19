const bookcovers = require("../src");


const MAX_API_RESPONSE_TIME = 30000

describe('bookcovers API', () => {
  it('fetches bookcovers from all services', async () => {
    const genderTrouble = '0415900433'
    const data = await bookcovers.withIsbn(genderTrouble)
    expect(data).toEqual({
      amazon: expect.objectContaining({
        "1.5x": expect.stringContaining('http'),
        "1x": expect.stringContaining('http'),
        "2.2935x": expect.stringContaining('http'),
        "2x": expect.stringContaining('http'),
      }),
      google: {
        "smallThumbnail":  expect.stringContaining('http'),
        "thumbnail":  expect.stringContaining('http'),
      },
      openLibrary: {
        "large": expect.stringContaining('http'),
        "medium": expect.stringContaining('http'),
        "small": expect.stringContaining('http'),
      }
  })
  }, MAX_API_RESPONSE_TIME)
})
