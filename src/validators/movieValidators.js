import {z} from "zod";

const registerMovieSchema = z.object({
    title: z.string().min(1, "Title is required!"),
    overview: z.string().trim().optional(),
    releaseYear: z
        .number({ invalid_type_error: "releaseYear must be a number"})
        .int("releaseYear must be an integer")
        .max(new Date().getFullYear() + 1, "releaseYear is invalid"),
    genres: z.array(z.string().trim().min(1)).default([]),
    runtime: z.number().int().optional(),
    posterUrl: z.string().url("posterurl must be a valid url").optional(),
})

const updateMovieSchema = z.object({
    title: z.string().trim().min(1,"Title is required!"),
    overview: z.string().trim().optional(),
    releaseYear: z
        .number({ invalid_type_error: "releaseYear must be a number"})
        .int("releaseYear must be an integer")
        .max(new Date().getFullYear() + 1, "releaseYear is invalid"),
    genres: z.array(z.string().trim().min(1)).default([]),
    runtime: z.number().int().optional(),
    posterUrl: z.string().url("posterurl must be a valid url").optional(),
})

export {registerMovieSchema, updateMovieSchema};