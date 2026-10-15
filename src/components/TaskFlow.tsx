import type { CheckState } from "../engine/evaluators";

export type TaskStep = Readonly<{
  id: string;
  label: string;
}>;

type TaskStepperProps = {
  steps: readonly TaskStep[];
  current: number;
  completed: readonly boolean[];
  onSelect: (index: number) => void;
};

export function TaskStepper({ steps, current, completed, onSelect }: TaskStepperProps) {
  return (
    <nav className="task-stepper" aria-label="Exercise progress">
      <ol>
        {steps.map((step, index) => {
          const unlocked = index === 0 || completed.slice(0, index).every(Boolean);
          const isComplete = completed[index] ?? false;
          return (
            <li key={step.id} className={isComplete ? "is-complete" : index === current ? "is-current" : ""}>
              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={!unlocked}
                aria-current={index === current ? "step" : undefined}
              >
                <span className="task-stepper__marker" aria-hidden="true">{isComplete ? "✓" : index + 1}</span>
                <span>{step.label}</span>
                <span className="sr-only">{isComplete ? ", complete" : index === current ? ", current" : unlocked ? ", available" : ", locked"}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

type CheckActionProps = {
  state: CheckState;
  onCheck: () => void;
  checkLabel: string;
  successLabel: string;
  incompleteMessage?: string;
  incorrectMessage?: string;
};

export function CheckAction({
  state,
  onCheck,
  checkLabel,
  successLabel,
  incompleteMessage = "There are still a few blanks to complete.",
  incorrectMessage = "Not quite. Compare the evidence, or reveal another hint.",
}: CheckActionProps) {
  if (state === "correct") {
    return (
      <div className="check-success" role="status" aria-live="polite">
        <span aria-hidden="true">✓</span>
        <span>{successLabel}</span>
      </div>
    );
  }

  const message = state === "incomplete" ? incompleteMessage : state === "incorrect" ? incorrectMessage : "";
  return (
    <>
      <button className="button button--primary button--wide" type="button" onClick={onCheck}>
        {checkLabel} <span aria-hidden="true">→</span>
      </button>
      <p className={`feedback feedback--${state}`} role="status" aria-live="polite">{message}</p>
    </>
  );
}
