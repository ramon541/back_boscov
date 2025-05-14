import z from "zod";

export const UserType = z.enum(["A", "C"]);

const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  email: z.string().email("E-mail inválido"),
  active: z.boolean().default(true),
  nickname: z.string(),
  birthDate: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date()
  ),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
  updatedAt: z
    .date()
    .optional()
    .default(() => new Date()),
  userType: UserType,
});

export interface IUser extends z.infer<typeof userSchema> {}

export default userSchema;
