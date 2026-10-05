import type { InputHTMLAttributes, ReactNode } from "react";
import { Controller, get, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { US_STATES } from "@/data/options";
import { cx } from "@/lib/cx";
import { formatPhone, formatSsn, formatZip } from "@/lib/format";

/** Shared look for every field in the application. All fields read the form from context. */

const fieldId = (name: string) => `f-${name.replace(/\./g, "-")}`;

function useFieldError(name: string): string | undefined {
  const { formState } = useFormContext();
  const error = get(formState.errors, name) as { message?: string } | undefined;
  return error?.message;
}

interface ShellProps {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

function FieldShell({ id, label, hint, error, optional, className, children }: ShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {optional && <span className="ml-1 font-normal opacity-50">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs opacity-60">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-brand">
          {error}
        </p>
      )}
    </div>
  );
}

type NativeInput = Pick<InputHTMLAttributes<HTMLInputElement>, "type" | "placeholder" | "autoComplete" | "inputMode" | "maxLength" | "disabled">;
interface BaseProps {
  name: string;
  label: ReactNode;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
}

export function TextField({ name, label, hint, optional, className, ...input }: BaseProps & NativeInput) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = fieldId(name);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input id={id} className={cx("input", error && "input-error")} aria-invalid={!!error} {...register(name)} {...input} />
    </FieldShell>
  );
}

/** Text input that reformats as you type (phone, SSN, ZIP). */
export function MaskedField({ name, label, hint, optional, className, mask, ...input }: BaseProps & NativeInput & { mask: (v: string) => string }) {
  const { control } = useFormContext();
  const error = useFieldError(name);
  const id = fieldId(name);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={id}
            ref={field.ref}
            value={(field.value as string) ?? ""}
            onBlur={field.onBlur}
            onChange={(e) => field.onChange(mask(e.target.value))}
            className={cx("input", error && "input-error")}
            aria-invalid={!!error}
            {...input}
          />
        )}
      />
    </FieldShell>
  );
}

export const PhoneField = (props: BaseProps) => <MaskedField mask={formatPhone} type="tel" inputMode="tel" autoComplete="tel" placeholder="(555) 555-5555" {...props} />;
export const ZipField = (props: BaseProps) => <MaskedField mask={formatZip} inputMode="numeric" autoComplete="postal-code" {...props} />;
export const SsnField = (props: BaseProps) => <MaskedField mask={formatSsn} inputMode="numeric" autoComplete="off" placeholder="123-45-6789" {...props} />;

export function SelectField({ name, label, hint, optional, className, options, placeholder = "Select..." }: BaseProps & { options: readonly string[]; placeholder?: string }) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = fieldId(name);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <select id={id} className={cx("input", error && "input-error")} aria-invalid={!!error} {...register(name)}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({ name, label, hint, optional, className, rows = 4 }: BaseProps & { rows?: number }) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const id = fieldId(name);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <textarea id={id} rows={rows} className={cx("input", error && "input-error")} aria-invalid={!!error} {...register(name)} />
    </FieldShell>
  );
}

/** Two big pill buttons; far easier to tap than a radio dot. */
export function YesNoField({ name, label, hint, className }: Omit<BaseProps, "optional">) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  return (
    <fieldset className={className}>
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex gap-3">
        {(["yes", "no"] as const).map((value) => (
          <label key={value} className="flex-1 sm:max-w-32">
            <input type="radio" value={value} className="peer sr-only" {...register(name)} />
            <span className="block cursor-pointer rounded-lg border border-ink/20 bg-white py-3 text-center font-semibold capitalize transition peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-brand/25">
              {value}
            </span>
          </label>
        ))}
      </div>
      {hint && !error && <p className="mt-1.5 text-xs opacity-60">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-brand">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function CheckField({ name, children, className }: { name: string; children: ReactNode; className?: string }) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  return (
    <div className={className}>
      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-ink/15 bg-white p-4 has-[:checked]:border-brand has-[:checked]:bg-brand/5">
        <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#e5281c]" {...register(name)} />
        <span className="text-sm leading-relaxed font-medium">{children}</span>
      </label>
      {error && (
        <p role="alert" className="mt-1.5 text-sm font-medium text-brand">
          {error}
        </p>
      )}
    </div>
  );
}

/** Renders its children only while the watched field holds `equals` (default "yes"). */
export function ShowIf({ name, equals = "yes", children, className }: { name: string; equals?: string; children: ReactNode; className?: string }) {
  const value = useWatch({ name });
  if (value !== equals) return null;
  return <div className={cx("animate-step-in space-y-4 border-l-2 border-brand/40 pl-4", className)}>{children}</div>;
}

/** A repeatable group of fields (addresses, employers, ...). `children` renders one row. */
export function Repeater({
  name,
  itemLabel,
  addLabel,
  blank,
  min = 0,
  max = 6,
  children,
}: {
  name: string;
  itemLabel: string;
  addLabel: string;
  blank: () => object;
  min?: number;
  max?: number;
  children: (prefix: string, index: number) => ReactNode;
}) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });
  return (
    <div className="space-y-5">
      {fields.map((row, index) => (
        <fieldset key={row.id} className="rounded-xl border border-ink/10 bg-white p-4 sm:p-5">
          <legend className="px-2 text-xs font-bold tracking-widest text-brand uppercase">
            {itemLabel} {index + 1}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">{children(`${name}.${index}`, index)}</div>
          {fields.length > min && (
            <button type="button" className="mt-4 cursor-pointer text-sm font-semibold text-brand hover:underline" onClick={() => remove(index)}>
              Remove this {itemLabel.toLowerCase()}
            </button>
          )}
        </fieldset>
      ))}
      {fields.length < max && (
        <button type="button" className="btn btn-outline" onClick={() => append(blank())}>
          + {addLabel}
        </button>
      )}
    </div>
  );
}

/** Street, city, state, ZIP. Used for the applicant, past addresses and every employer. */
export function AddressFields({ prefix = "" }: { prefix?: string }) {
  const at = (key: string) => (prefix ? `${prefix}.${key}` : key);
  return (
    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-6">
      <TextField name={at("street")} label="Street address" autoComplete="street-address" className="sm:col-span-6" />
      <TextField name={at("city")} label="City" className="sm:col-span-3" />
      <SelectField name={at("state")} label="State" options={US_STATES} placeholder="State" className="sm:col-span-1" />
      <ZipField name={at("zip")} label="ZIP" className="sm:col-span-2" />
    </div>
  );
}
