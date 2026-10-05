import { z } from "zod";

export type Ctx = z.RefinementCtx;

const digits = (value: string) => value.replace(/\D/g, "");

export const required = (message = "Required") => z.string().trim().min(1, message);
// An unanswered radio group reads back as null, so treat null as "not answered yet".
// The explicit `boolean` return stops TypeScript narrowing the form value to "yes" | "no".
export const yesNo = z.preprocess(
  (v) => v ?? "",
  z.string().refine((v): boolean => v === "yes" || v === "no", "Please choose Yes or No"),
);
export const phone = z.string().refine((v) => digits(v).length === 10, "Enter a 10-digit phone number");
export const email = z.string().trim().min(1, "Required").email("Enter a valid email address");
export const ssn = z.string().refine((v) => digits(v).length === 9, "Enter your 9-digit Social Security number");
export const zip = z.string().refine((v) => /^\d{5}$/.test(v.trim()), "Enter a 5-digit ZIP code");
export const dateField = (message = "Required") => z.string().min(1, message);
export const agreed = (message = "Please check the box to continue") => z.boolean().refine((v): boolean => v === true, message);

/** Adds a "Required" issue at `path` when `when` is true and `value` is blank. */
export function requireWhen(ctx: Ctx, when: boolean, value: string | undefined, path: Array<string | number>, message = "Required") {
  if (when && !(value ?? "").trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });
}

/** Builds a wizard step: its field shape plus an optional cross-field rule set. */
export function step<S extends z.ZodRawShape>(shape: S, rules?: (data: z.infer<z.ZodObject<S>>, ctx: Ctx) => void) {
  const base = z.object(shape);
  const schema: z.ZodTypeAny = rules ? base.superRefine((data, ctx) => rules(data as z.infer<z.ZodObject<S>>, ctx)) : base;
  return { shape, schema };
}
