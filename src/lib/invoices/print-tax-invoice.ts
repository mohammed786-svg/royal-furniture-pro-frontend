const PRINT_BODY_CLASS = "tax-invoice-print-active";
const PRINT_HOST_ID = "tax-invoice-print-host";
const DEFAULT_PRINT_ROOT_ID = "tax-invoice-print";

/** Print only the tax invoice — clones to body to avoid blank pages from hidden layout. */
export function printTaxInvoice(printRootId = DEFAULT_PRINT_ROOT_ID) {
  const source = document.getElementById(printRootId);
  if (!source) {
    window.print();
    return;
  }

  const existing = document.getElementById(PRINT_HOST_ID);
  existing?.remove();

  const host = document.createElement("div");
  host.id = PRINT_HOST_ID;
  host.className = "tax-invoice-print-portal";
  host.appendChild(source.cloneNode(true));
  document.body.appendChild(host);
  document.body.classList.add(PRINT_BODY_CLASS);

  const cleanup = () => {
    document.body.classList.remove(PRINT_BODY_CLASS);
    document.getElementById(PRINT_HOST_ID)?.remove();
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup);
  window.setTimeout(cleanup, 2000);

  window.print();
}
