"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchVaultTransactions,
  getVaultGroupId,
  vaultKeyFingerprint,
  truncateHash,
  type NovaTransaction,
} from "@/lib/vault-nova";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { NexusButton } from "@/components/ui/NexusButton";
import {
  FileImage,
  FileText,
  StickyNote,
  Database,
  Plus,
  Eye,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";

const BG = "#000000";
const CARD_BG = "#0A0A0F";
const BORDER = "rgba(255,255,255,0.06)";
const MUTED = "rgba(255,255,255,0.45)";
const MUTED_65 = "rgba(255,255,255,0.65)";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-white/10 ${className ?? ""}`}
      aria-hidden
    />
  );
}

function VaultStatusBar({
  totalFiles,
  storageUsed,
  lastSynced,
  groupId,
  keyFingerprint,
  loading,
}: {
  totalFiles: number;
  storageUsed: string;
  lastSynced: string;
  groupId: string;
  keyFingerprint: string;
  loading: boolean;
}) {
  return (
    <header className="border-b border-[rgba(255,255,255,0.06)] pb-6">
      <h1 className="text-[28px] font-medium text-white tracking-tight">
        Memory Vault
      </h1>
      <p className="mt-1 text-sm" style={{ color: MUTED }}>
        Your encrypted data. Zero exposure.
      </p>
      {loading ? (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Skeleton className="h-20 rounded-[20px]" />
          <Skeleton className="h-20 rounded-[20px]" />
          <Skeleton className="h-20 rounded-[20px]" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            className="rounded-[20px] border p-5"
            style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
          >
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: MUTED }}>
              Total Files
            </p>
            <p className="mt-1 text-xl font-medium text-white">{totalFiles}</p>
          </div>
          <div
            className="rounded-[20px] border p-5"
            style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
          >
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: MUTED }}>
              Storage Used
            </p>
            <p className="mt-1 text-xl font-medium text-white">{storageUsed}</p>
          </div>
          <div
            className="rounded-[20px] border p-5"
            style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
          >
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: MUTED }}>
              Last Synced
            </p>
            <p className="mt-1 text-xl font-medium text-white">{lastSynced}</p>
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono" style={{ color: MUTED_65 }}>
        <span>Vault ID: {truncateHash(groupId, 8)}</span>
        <span>Key fingerprint: {keyFingerprint}</span>
      </div>
    </header>
  );
}

function fileTypeFromHash(filenameOrHash: string): "document" | "photo" | "note" | "dataset" {
  const lower = filenameOrHash.toLowerCase();
  if (lower.includes("pdf") || lower.includes("doc") || lower.includes("txt")) return "document";
  if (lower.includes("jpg") || lower.includes("png") || lower.includes("image")) return "photo";
  if (lower.includes("json") || lower.includes("csv") || lower.includes("data")) return "dataset";
  return "note";
}

function FileTypeBadge({ type }: { type: "document" | "photo" | "note" | "dataset" }) {
  const labels = { document: "Document", photo: "Photo", note: "Note", dataset: "Dataset" };
  return (
    <span
      className="rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
      style={{ borderColor: BORDER, color: MUTED_65 }}
    >
      {labels[type]}
    </span>
  );
}

function MemoryBlockCard({
  tx,
  onView,
  onShare,
  onDelete,
}: {
  tx: NovaTransaction;
  onView: (tx: NovaTransaction) => void;
  onShare: (tx: NovaTransaction) => void;
  onDelete: (tx: NovaTransaction) => void;
}) {
  const type = fileTypeFromHash(tx.file_hash);
  const size = "—";
  const dateAdded = "—";

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border p-4 transition-colors hover:bg-white/[0.02]"
      style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <span className="font-mono text-sm text-white" style={{ color: MUTED_65 }}>
          {truncateHash(tx.file_hash, 8)}
        </span>
        <FileTypeBadge type={type} />
        <span className="text-xs font-mono" style={{ color: MUTED }}>{dateAdded}</span>
        <span className="text-xs font-mono" style={{ color: MUTED }}>{size}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onView(tx)}
          className="rounded border px-3 py-1.5 text-xs font-medium transition-colors hover:border-white/20 hover:text-white"
          style={{ borderColor: BORDER, color: MUTED_65 }}
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onShare(tx)}
          className="rounded border px-3 py-1.5 text-xs font-medium transition-colors hover:border-white/20 hover:text-white"
          style={{ borderColor: BORDER, color: MUTED_65 }}
        >
          Share Access
        </button>
        <button
          type="button"
          onClick={() => onDelete(tx)}
          className="rounded border px-3 py-1.5 text-xs font-medium transition-colors hover:border-red-500/50 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:text-red-400"
          style={{ borderColor: BORDER, color: MUTED_65 }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function MemoryBlocksList({
  accountId,
  transactions,
  loading,
  onAdd,
  onView,
  onShare,
  onDelete,
}: {
  accountId: string | null;
  transactions: NovaTransaction[];
  loading: boolean;
  onAdd: () => void;
  onView: (tx: NovaTransaction) => void;
  onShare: (tx: NovaTransaction) => void;
  onDelete: (tx: NovaTransaction) => void;
}) {
  if (!accountId) {
    return (
      <div
        className="rounded-[20px] border p-8 text-center"
        style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
      >
        <p className="text-sm" style={{ color: MUTED }}>
          Connect your NEAR wallet to access the Memory Vault.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Encrypted Memory Blocks</h2>
        <NexusButton
          variant="secondary"
          size="sm"
          onClick={onAdd}
          className="border-white/10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add to Vault
        </NexusButton>
      </div>
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-[20px]" />
          <Skeleton className="h-16 w-full rounded-[20px]" />
          <Skeleton className="h-16 w-full rounded-[20px]" />
        </div>
      ) : transactions.length === 0 ? (
        <div
          className="rounded-[20px] border border-dashed p-12 text-center"
          style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
        >
          <p className="text-sm" style={{ color: MUTED }}>
            No encrypted blocks. Add files via the panel or Encrypt & Store.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, i) => (
            <MemoryBlockCard
              key={`${tx.file_hash}-${tx.ipfs_hash}-${i}`}
              tx={tx}
              onView={onView}
              onShare={onShare}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function UploadPanel({ onEncryptStore, disabled }: { onEncryptStore: () => void; disabled?: boolean }) {
  const [drag, setDrag] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const files = e.dataTransfer?.files;
    if (files?.length) onEncryptStore();
  }, [onEncryptStore]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(true);
  }, []);

  const handleDragLeave = useCallback(() => setDrag(false), []);

  return (
    <div
      className="rounded-[20px] border p-6"
      style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
    >
      <h3 className="text-sm font-medium text-white">Upload / Add Memory</h3>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 transition-colors ${
          drag ? "border-white/20 bg-white/5" : ""
        }`}
        style={{ borderColor: drag ? undefined : BORDER }}
      >
        <div className="flex gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border" style={{ borderColor: BORDER }}>
            <FileImage className="h-5 w-5" style={{ color: MUTED_65 }} />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border" style={{ borderColor: BORDER }}>
            <FileText className="h-5 w-5" style={{ color: MUTED_65 }} />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border" style={{ borderColor: BORDER }}>
            <StickyNote className="h-5 w-5" style={{ color: MUTED_65 }} />
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border" style={{ borderColor: BORDER }}>
            <Database className="h-5 w-5" style={{ color: MUTED_65 }} />
          </div>
        </div>
        <p className="mt-3 text-xs" style={{ color: MUTED }}>
          Photo / Document / Note / Dataset
        </p>
        <p className="mt-2 max-w-[220px] text-center text-xs" style={{ color: MUTED }}>
          Files are encrypted before upload via NOVA.
        </p>
      </div>
      <button
        type="button"
        onClick={onEncryptStore}
        disabled={disabled}
        className="mt-6 flex w-full items-center justify-center rounded-[14px] border-2 border-[#6C5CE7] bg-transparent py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(108,92,231,0.15)] transition-colors hover:border-[#00D4FF] hover:shadow-[0_0_24px_rgba(0,212,255,0.2)] disabled:opacity-50"
      >
        <Upload className="mr-2 h-4 w-4" />
        Encrypt & Store
      </button>
    </div>
  );
}

function AIInteractionBar() {
  const examples = [
    "Summarize my uploaded documents",
    "Find my health records",
    "Share my dataset with [wallet]",
  ];
  const chatHref = "/?vault=1";

  return (
    <div
      className="rounded-[20px] border p-6"
      style={{ backgroundColor: CARD_BG, borderColor: BORDER }}
    >
      <p className="text-sm font-medium text-white">Ask NexusAI about your vault…</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <Link
            key={ex}
            href={`${chatHref}&q=${encodeURIComponent(ex)}`}
            className="rounded-lg border px-3 py-2 text-xs transition-colors hover:border-white/20 hover:text-white"
            style={{ borderColor: BORDER, color: MUTED_65 }}
          >
            {ex}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function VaultPage() {
  const { accountId } = useWallet();
  const queryClient = useQueryClient();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const groupId = accountId ? getVaultGroupId(accountId) : "";
  const keyFingerprint = accountId ? vaultKeyFingerprint(accountId) : "—";

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ["vault-transactions", accountId],
    queryFn: () => (accountId ? fetchVaultTransactions(accountId) : Promise.resolve([])),
    enabled: !!accountId,
  });

  const totalFiles = transactions.length;
  const storageUsed = "—";
  const lastSynced = txLoading ? "—" : "Just now";

  const handleAddToVault = () => setAddModalOpen(true);
  const handleEncryptStore = () => setUploadModalOpen(true);

  const handleView = (_tx: NovaTransaction) => {
    // TODO: open viewer / decrypt flow
  };
  const handleShare = (_tx: NovaTransaction) => {
    // TODO: share access flow
  };
  const handleDelete = (_tx: NovaTransaction) => {
    // TODO: delete from vault (contract + local)
    queryClient.invalidateQueries({ queryKey: ["vault-transactions", accountId] });
  };

  return (
    <div className="min-h-full" style={{ backgroundColor: BG }}>
      <div className="mx-auto max-w-6xl space-y-8">
        <VaultStatusBar
          totalFiles={totalFiles}
          storageUsed={storageUsed}
          lastSynced={lastSynced}
          groupId={groupId}
          keyFingerprint={keyFingerprint}
          loading={!!accountId && txLoading}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.4fr]">
          <div className="min-w-0">
            <MemoryBlocksList
              accountId={accountId}
              transactions={transactions}
              loading={!!accountId && txLoading}
              onAdd={handleAddToVault}
              onView={handleView}
              onShare={handleShare}
              onDelete={handleDelete}
            />
          </div>
          <div className="lg:max-w-sm">
            <UploadPanel onEncryptStore={handleEncryptStore} disabled={!accountId} />
          </div>
        </div>

        <AIInteractionBar />
      </div>

      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent
          className="border bg-[#0A0A0F] text-white"
          style={{ borderColor: BORDER }}
        >
          <DialogHeader>
            <DialogTitle className="text-white">Add to Vault</DialogTitle>
            <DialogDescription style={{ color: MUTED }}>
              Choose a file to encrypt and store in your NOVA vault. Encrypted client-side before upload.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed py-10 transition-colors hover:border-white/20"
              style={{ borderColor: BORDER }}
              onClick={() => setUploadModalOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && setUploadModalOpen(true)}
              role="button"
              tabIndex={0}
            >
              <Upload className="h-10 w-10" style={{ color: MUTED_65 }} />
              <p className="mt-2 text-sm" style={{ color: MUTED_65 }}>
                Select file or use Encrypt & Store panel
              </p>
            </div>
          </div>
          <DialogFooter>
            <NexusButton variant="secondary" onClick={() => setAddModalOpen(false)}>
              Close
            </NexusButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent
          className="border bg-[#0A0A0F] text-white"
          style={{ borderColor: BORDER }}
        >
          <DialogHeader>
            <DialogTitle className="text-white">Encrypt & Store</DialogTitle>
            <DialogDescription style={{ color: MUTED }}>
              Files are encrypted client-side via NOVA before upload. Requires NEAR wallet and vault registration.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm" style={{ color: MUTED_65 }}>
              Production upload uses NOVA SDK with wallet signing and Pinata IPFS. Connect wallet and ensure vault group is registered.
            </p>
          </div>
          <DialogFooter>
            <NexusButton variant="secondary" onClick={() => setUploadModalOpen(false)}>
              Close
            </NexusButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
