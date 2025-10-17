export function isAuthSessionMissingError(error: unknown): boolean {
  if (!error) {
    return false;
  }

  if (typeof error === "string") {
    return error.toLowerCase().includes("auth session missing");
  }

  if (typeof error === "object" && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "");
    return message.toLowerCase().includes("auth session missing");
  }

  return false;
}

