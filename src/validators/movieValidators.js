import {z} from "zod";

const movieSchema = z.object({
    title: z.string()
})