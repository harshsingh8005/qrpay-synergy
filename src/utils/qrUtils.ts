
// Generate a payment URI in the UPI format
export function generateUpiPaymentUri(
  vpa: string,
  name: string,
  amount?: number,
  message?: string
): string {
  // Create a UPI payment URI
  let uri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}`;
  
  // Add optional parameters if provided
  if (amount) {
    uri += `&am=${encodeURIComponent(amount.toString())}`;
  }
  
  if (message) {
    uri += `&tn=${encodeURIComponent(message)}`;
  }
  
  // Add a currency code (INR is the default for UPI)
  uri += '&cu=INR';
  
  return uri;
}

// Function to copy text to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};
