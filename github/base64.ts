/**
 * stringFromBlob converts a Blob to a base64 string promise.
 */
export function stringFromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Expected reader.result to be a string."));
        return;
      }

      const payload = reader.result.split(",");
      if (payload.length !== 2) {
        reject(new Error("Expected reader.result to be a base64 string."));
        return;
      }

      resolve(payload[1]);
    };
    reader.readAsDataURL(blob);
  });
}
