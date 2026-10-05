/* eslint-disable @typescript-eslint/no-explicit-any */
export function normalizeFormData(formData: FormData): Record<string, any> {
  const values: Record<string, any> = {};

  formData.forEach((value, key) => {
    // Handle checkboxes / booleans
    if (value === "true") {
      values[key] = true;
    } else if (value === "false") {
      values[key] = false;
    }
    // Handle numbers
    else if (!isNaN(Number(value)) && value !== "") {
      values[key] = Number(value);
    }
    // Handle empty strings
    else if (value === "") {
      values[key] = undefined;
    }
    // Otherwise keep string / Blob
    else {
      values[key] = value;
    }
  });

  return values;
}
