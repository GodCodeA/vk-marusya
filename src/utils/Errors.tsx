export function isAuthError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as any).response === "object" &&
    ((error as any).response?.status === 401 ||
      (error as any).response?.status === 403)
  );
}

export function getFavoritesErrorMessage(error: unknown): string {
  return "Failed to load favorites. Please try again later.";
}
