"use client";

import { Settings } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="max-w-2xl mx-auto py-12">
      <div className="card-origin p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <Settings className="w-7 h-7 text-accent" />
        </div>
        <h1 className="text-2xl font-semibold text-white mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Manage your account and preferences. Coming soon.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white text-primary-foreground h-11 px-5 text-sm font-medium hover:bg-white/90"
        >
          Back to Assistant
        </Link>
      </div>
    </main>
  );
}
