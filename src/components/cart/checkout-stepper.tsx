type CheckoutStepperProps = {
  activeStep?: 1 | 2 | 3;
};

const STEPS = [
  { num: 1, label: "Cart" },
  { num: 2, label: "Address" },
  { num: 3, label: "Payment" },
] as const;

export function CheckoutStepper({ activeStep = 1 }: CheckoutStepperProps) {
  return (
    <nav className="checkout-stepper" aria-label="Checkout progress">
      <ol className="checkout-stepper__list">
        {STEPS.map((step, index) => {
          const isActive = step.num === activeStep;
          const isComplete = step.num < activeStep;
          const isLast = index === STEPS.length - 1;

          return (
            <li
              key={step.num}
              className={`checkout-stepper__item${isLast ? " checkout-stepper__item--last" : ""}`}
            >
              <div className="checkout-stepper__node-wrap">
                <span
                  className={`checkout-stepper__node${isActive ? " checkout-stepper__node--active" : ""}${isComplete ? " checkout-stepper__node--done" : ""}`}
                >
                  {step.num}
                </span>
                {!isLast && (
                  <span
                    className={`checkout-stepper__line${isActive || isComplete ? " checkout-stepper__line--active" : ""}`}
                    aria-hidden
                  />
                )}
              </div>
              <span
                className={`checkout-stepper__label${isActive ? " checkout-stepper__label--active" : ""}`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
