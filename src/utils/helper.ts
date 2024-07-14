// Function to retrieve truthy value
export function convertToTruth (value: any): boolean {
  return typeof value !== 'undefined' && value !== null && String(value) !== '0' && value !== undefined
}


export function generateAccountNumber(): string {
  // Generate your account number logic here (example implementation)
  return Math.random().toString().substr(2, 9);
}