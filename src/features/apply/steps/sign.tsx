import { useWatch } from "react-hook-form";
import { TextField } from "../fields";
import { SignatureField } from "../SignatureField";
import { ApplicationSummary } from "../ApplicationSummary";
import type { ApplicationData } from "../schema/application";
import { StepNote } from "./StepNote";

export function SignStep() {
  const values = useWatch() as ApplicationData;
  return (
    <div className="space-y-6">
      <StepNote>Take a last look. Use Back to fix anything. Your SSN is hidden here except for the last four digits.</StepNote>
      <ApplicationSummary data={values} />
      <div className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-ink/10">
        <h3 className="display text-xl">Sign your application</h3>
        <TextField name="printedName" label="Type your full legal name" autoComplete="name" />
        <SignatureField name="signature" label="Draw your signature" />
        <p className="text-xs leading-relaxed opacity-65">
          By signing, I confirm that everything in this application is true and complete, and I agree that this electronic signature applies to the application and to each authorization and consent
          above. Date: {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}.
        </p>
      </div>
    </div>
  );
}
