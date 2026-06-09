/** Demo credentials for OTP login/register until backend is ready */
export const DEMO_MOBILE = "8296565587";
export const DEMO_OTP = "123456";

export function isDemoMobile(mobile: string): boolean {
  const digits = mobile.replace(/\D/g, "");
  return digits === DEMO_MOBILE || digits.endsWith(DEMO_MOBILE);
}

export function isDemoOtp(code: string): boolean {
  return code === DEMO_OTP;
}
