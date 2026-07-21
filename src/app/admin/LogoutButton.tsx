"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="glass cursor-pointer rounded-full px-4 py-2 text-xs font-medium hover:text-[var(--accent-2)]"
    >
      Se déconnecter
    </button>
  );
}
