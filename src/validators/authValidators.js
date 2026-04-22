import {z} from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be atleast 2 characters long!"),
    email: z
    .string()
    .trim()
    .max(254, "Email is too long")
    .email("Invalid email format")
    .refine((val) => val === val.toLowerCase(), {
        message: "Email must be lowercase",
    })
    .refine((val) => val.split("@")[0]?.length <= 64, {
        message: "Email local part is too long",
    })
    .refine((val) => /\.[a-z]{2,}$/i.test(val.split("@")[1] || ""), {
        message: "Email domain must include a valid TLD",
    })
    .refine((val) => !val.includes(".."), {
        message: "Email cannot contain consecutive dots",
    }),
    password: z.string().min(8, "Password must be atleast 8 characters long!")
})

const loginSchema = z.object({
    email: z.string().trim()
    .max(254, "Email is too long")
    .email("Invalid email format")
    .refine((val) => val === val.toLowerCase(), {
        message: "Email must be lowercase",
    })
    .refine((val) => val.split("@")[0]?.length <= 64, {
        message: "Email local part is too long",
    })
    .refine((val) => /\.[a-z]{2,}$/i.test(val.split("@")[1] || ""), {
        message: "Email domain must include a valid TLD",
    })
    .refine((val) => !val.includes(".."), {
        message: "Email cannot contain consecutive dots",
    }),
    password: z.string().min(8, "Password must be atleast 8 characters long!")
})

export {registerSchema, loginSchema};
