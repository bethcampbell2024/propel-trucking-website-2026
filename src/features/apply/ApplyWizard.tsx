import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { DEMO_MODE } from "@/data/company";
import { sampleApplication } from "@/demo/sampleData";
import { applicationService } from "@/services/applications";
import { clearDraft, saveDraft, type Draft } from "./draft";
import { Progress } from "./Progress";
import { emptyApplication } from "./schema/defaults";
import type { ApplicationData } from "./schema/application";
import { firstInvalidStep, STEPS } from "./steps";

const asResolver = zodResolver as unknown as (schema: unknown) => Resolver<ApplicationData>;

/**
 * Drives the one-section-at-a-time experience. Each step validates only its own
 * schema before letting you move on; the full set is re-checked on submit.
 */
export function ApplyWizard({ initial }: { initial: Draft | null }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(Math.min(initial?.step ?? 0, STEPS.length - 1));
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  // The resolver always validates against whichever step is on screen.
  const schemaRef = useRef(step.schema);
  schemaRef.current = step.schema;

  const form = useForm<ApplicationData>({
    defaultValues: { ...emptyApplication(), ...initial?.values },
    resolver: (values, context, options) => asResolver(schemaRef.current)(values, context, options),
    // Stay quiet until Continue is pressed; after a failed attempt, errors clear the instant
    // they're fixed (not on blur, which shifts the layout under the button mid-click).
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "start" });
    // New step, clean slate: drop errors and the "already tried to submit" flag, keep every value.
    form.reset(undefined, { keepValues: true, keepDefaultValues: true });
    setNotice("");
    saveDraft(form.getValues(), index);
  }, [index, form]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const subscription = form.watch((values) => {
      clearTimeout(timer);
      timer = setTimeout(() => saveDraft(values as ApplicationData, indexRef.current), 300);
    });
    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [form]);

  const submit = async () => {
    const values = form.getValues();
    const problem = firstInvalidStep(values);
    if (problem !== -1) {
      setNotice(`Please finish "${STEPS[problem].title}" before submitting.`);
      setIndex(problem);
      return;
    }
    setSubmitting(true);
    const saved = await applicationService.submit(values);
    clearDraft();
    navigate("/apply/thanks", { state: { id: saved.id, firstName: values.firstName } });
  };

  // handleSubmit validates the current step, focuses the first error, and only calls back when valid.
  const goNext = form.handleSubmit(async () => {
    if (isLast) await submit();
    else setIndex(index + 1);
  });

  const fillSample = (jumpToEnd: boolean) => {
    form.reset(sampleApplication());
    if (jumpToEnd) setIndex(STEPS.length - 1);
  };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={goNext}
        className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14"
      >
        <div ref={topRef} className="scroll-mt-28" />
        <Progress index={index} />

        <div key={step.id} className="animate-step-in mt-8">
          <h2 className="display text-3xl sm:text-4xl">{step.title}</h2>
          {step.lead && <p className="mt-2 text-lg opacity-70">{step.lead}</p>}
          <div className="mt-7">{step.render()}</div>
        </div>

        {notice && (
          <p role="alert" className="mt-6 rounded-lg bg-brand/10 px-4 py-3 text-sm font-semibold text-brand">
            {notice}
          </p>
        )}

        <div className="sticky bottom-0 z-10 -mx-5 mt-10 flex items-center justify-between gap-3 border-t border-ink/10 bg-paper/95 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
          {index > 0 ? (
            <button type="button" className="btn btn-outline" onClick={() => setIndex(index - 1)}>
              Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn-primary min-w-40" disabled={submitting}>
            {submitting ? "Submitting..." : isLast ? "Submit application" : "Continue"}
          </button>
        </div>

        {DEMO_MODE && (
          <p className="mt-10 rounded-lg border border-dashed border-ink/25 p-3 text-xs">
            <strong>Demo tools:</strong>{" "}
            <button type="button" className="cursor-pointer font-semibold text-brand underline" onClick={() => fillSample(false)}>
              Fill with sample data
            </button>{" "}
            or{" "}
            <button type="button" className="cursor-pointer font-semibold text-brand underline" onClick={() => fillSample(true)}>
              fill and jump to the review step
            </button>
            .
          </p>
        )}
      </form>
    </FormProvider>
  );
}
