"use client";

import { useState } from "react";
import { Ban, Eye, Search, ShieldCheck, UserRound, Users } from "lucide-react";
import { toast } from "sonner";
import { blockUser, getUsers, unblockUser } from "@/lib/actions";
import { getErrorMessage } from "@/lib/api";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cardClass, inputClass } from "@/components/ui/styles";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/format";
import type { CurrentUser } from "@/types";
import DataTable, { type Column } from "../DataTable";
import PageHeader from "../PageHeader";
import { RequireRole, useDashboardUser } from "../DashboardProvider";

function Avatar({ user, size = 40 }: { user: CurrentUser; size?: number }) {
  return user.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.image} alt={user.name} style={{ width: size, height: size }} className="shrink-0 rounded-full object-cover" />
  ) : (
    <span style={{ width: size, height: size }} className="flex shrink-0 items-center justify-center rounded-full bg-[#F3EAE3] text-[#A66C62]">
      <UserRound size={size / 2} />
    </span>
  );
}

function Manage() {
  const { user: me } = useDashboardUser();

  const [searchInput, setSearchInput] = useState("");
  const [blocked, setBlocked] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CurrentUser | null>(null);
  const [target, setTarget] = useState<CurrentUser | null>(null);
  const [working, setWorking] = useState(false);

  const search = useDebouncedValue(searchInput.trim());

  const { data, error, loading, reload } = useAsyncData(
    () => getUsers({ search, isBlocked: blocked, page, limit: 8 }),
    `admin-users:${search}:${blocked}:${page}`,
  );

  const handleToggleBlock = async () => {
    if (!target) return;

    setWorking(true);

    try {
      const result = target.isBlocked ? await unblockUser(target._id) : await blockUser(target._id);
      toast.success(result.message);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setWorking(false);
      setTarget(null);
      reload();
    }
  };

  const actions = (u: CurrentUser) => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="secondary" onClick={() => setSelected(u)}>
        <Eye size={14} /> Details
      </Button>
      {u._id !== me._id && (
        <Button
          size="sm"
          variant={u.isBlocked ? "secondary" : "ghost"}
          className={u.isBlocked ? "" : "text-red-600 hover:bg-red-50"}
          onClick={() => setTarget(u)}
        >
          {u.isBlocked ? <><ShieldCheck size={14} /> Unblock</> : <><Ban size={14} /> Block</>}
        </Button>
      )}
    </div>
  );

  const columns: Column<CurrentUser>[] = [
    {
      key: "customer",
      header: "Customer Name",
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar user={u} />
          <p className="max-w-[180px] truncate font-semibold">{u.name}</p>
        </div>
      ),
    },
    { key: "email", header: "Email", render: (u) => <span className="text-[#82736C]">{u.email}</span> },
    { key: "status", header: "Account Status", render: (u) => <StatusBadge status={u.isBlocked ? "blocked" : "active"} /> },
    { key: "registered", header: "Registered", render: (u) => <span className="whitespace-nowrap text-xs text-[#82736C]">{formatDate(u.createdAt)}</span> },
    { key: "actions", header: "Actions", render: actions },
  ];

  return (
    <div>
      <PageHeader title="Manage Users" description="View registered customers and block or unblock accounts." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82736C]" />
          <input
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
            placeholder="Search by name or email"
            className={`${inputClass} pl-10`}
          />
        </div>
        <select value={blocked} onChange={(e) => { setBlocked(e.target.value); setPage(1); }} className={`${inputClass} sm:w-48`}>
          <option value="">All accounts</option>
          <option value="false">Active</option>
          <option value="true">Blocked</option>
        </select>
      </div>

      <div className={cardClass}>
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(u) => u._id}
              loading={loading}
              empty={<EmptyState icon={<Users size={26} />} title="No customers found" description="Registered customers will appear here." />}
              mobileCard={(u) => (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar user={u} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#49342D]">{u.name}</p>
                      <p className="truncate text-xs text-[#82736C]">{u.email}</p>
                    </div>
                    <StatusBadge status={u.isBlocked ? "blocked" : "active"} />
                  </div>
                  {actions(u)}
                </div>
              )}
            />
            <Pagination pagination={data?.pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <Modal
        open={Boolean(selected)}
        title="Customer details"
        onClose={() => setSelected(null)}
        footer={<Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>}
      >
        {selected && (
          <div>
            <div className="mb-4 flex items-center gap-4">
              <Avatar user={selected} size={64} />
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-[#49342D]">{selected.name}</p>
                <StatusBadge status={selected.isBlocked ? "blocked" : "active"} />
              </div>
            </div>
            <dl className="divide-y divide-[#EDE4DC] text-sm">
              {[
                ["Email", selected.email],
                ["Phone", selected.phone || "Not provided"],
                ["Role", selected.role],
                ["Registered", formatDate(selected.createdAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-[#82736C]">{label}</dt>
                  <dd className="break-all text-right font-medium capitalize text-[#49342D]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(target)}
        title={target?.isBlocked ? "Unblock this user?" : "Block this user?"}
        description={
          target?.isBlocked
            ? `${target.name} will be able to use the platform again.`
            : `${target?.name ?? "This user"} will be signed out of protected features and will not be able to book or manage appointments.`
        }
        confirmLabel={target?.isBlocked ? "Unblock user" : "Block user"}
        tone={target?.isBlocked ? "primary" : "danger"}
        loading={working}
        onConfirm={handleToggleBlock}
        onClose={() => setTarget(null)}
      />
    </div>
  );
}

export default function ManageUsers() {
  return (
    <RequireRole role="admin">
      <Manage />
    </RequireRole>
  );
}
