import zod from 'zod'

const movieSchema = zod.object({
  title: zod
    .string({
      invalid_type_error: 'Movie title must be a string',
      required_error: 'Movie title is required'
    }),
  release_year: zod
    .number({
      invalid_type_error: 'Movie release_year must be a number',
      required_error: 'Movie release_year is required'
    })
    .int()// Para que no tenga decimales
    .min(1900, { message: 'Movie release_year more than 1900' })
    .max(2999, { message: 'Movie release_year less than 2999' }),
  duration: zod
    .number({
      invalid_type_error: 'Movie duration must be a string',
      required_error: 'Movie duration is required'
    })
    .int()
    .positive(),
  rating: zod
    .number({
      invalid_type_error: 'Movie rating must be a string',
      required_error: 'Movie rating is required'
    })
    .min(0)
    .max(10)
    .default(1),
  description: zod
    .string({
      invalid_type_error: 'Movie description must be a string',
      required_error: 'Movie description is required'
    }),
  genres: zod
    .array(
      zod.enum(['science fiction', 'action', 'drama', 'crime', 'romance', 'adventure', 'fantasy', 'animation', 'war', 'history', 'thriller']),
      { message: 'Movie genres is required' }
    )
    .nonempty({ message: "Genres can't be empty" })
})

export function validateMovie (object) {
  return movieSchema.safeParse(object)
}

export function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object)
}
