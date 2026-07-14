// app/lib/network.ts
"use client";

export function getConnectionInfo() {
  if (typeof navigator === "undefined") {
    return { saveData: false, effectiveType: "4g" as const };
  }
  const conn =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!conn) return { saveData: false, effectiveType: "4g" as const };

  return {
    saveData: !!conn.saveData,
    effectiveType: (conn.effectiveType || "4g") as
      | "slow-2g"
      | "2g"
      | "3g"
      | "4g",
  };
}

// true on slow-2g / 2g / 3g / data-saver — video should NOT be fetched at all
export function isSlowConnection() {
  const { saveData, effectiveType } = getConnectionInfo();
  if (saveData) return true;
  return effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g";
}