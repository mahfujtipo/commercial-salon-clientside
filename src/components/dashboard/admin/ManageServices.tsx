"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Power, Scissors, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteService, getAdminServices, getCategories, setServiceStatus } from "@/lib/actions";
import { getErrorMessage } from "@/lib/api";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cardClass, inputClass } from "@/components/ui/styles";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import Pagination from "@/components/ui/Pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDuration, formatPrice } from "@/lib/format";
import type { PriceSort, Service, ServiceStatus } from "@/types";
import DataTable, { type Column } from "../DataTable";
import PageHeader from "../PageHeader";
import { RequireRole } from "../DashboardProvider";
import { CATEGORY_SUGGESTIONS } from "./ServiceForm";

function Manage() {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ServiceStatus | "">("");
  const [sort, setSort] = useState<PriceSort>("newest");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const search = useDebouncedValue(searchInput.trim());

  const { data, error, loading, reload } = useAsyncData(
    () => getAdminServices({ search, category, status, sort, page, limit: 8 }),
    `admin-services:${search}:${category}:${status}:${sort}:${page}`,
  );

  const categoriesData = useAsyncData(getCategories, "service-categories");
  const categories = Array.from(
    new Set([...CATEGORY_SUGGESTIONS, ...(categoriesData.data?.map((c) => c.category) ?? [])]),
  ).sort();

  const handleToggle = async (service: Service) => {
    const next: ServiceStatus = service.status === "active" ? "inactive" : "active";

    setTogglingId(service._id);

    try {
      const result = await setServiceStatus(service._id, next);
      toast.success(result.message);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;

    setDeleting(true);

    try {
      const result = await deleteService(toDelete._id);
      toast.success(result.message || "Service deleted successfully.");
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to delete the service."));
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  const actions = (s: Service) => (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/dashboard/services/${s._id}/edit`}>
        <Button size="sm" variant="secondary"><Pencil size={14} /> Edit</Button>
      </Link>
      <Button size="sm" variant="secondary" loading={togglingId === s._id} onClick={() => handleToggle(s)}>
        <Power size={14} /> {s.status === "active" ? "Deactivate" : "Activate"}
      </Button>
      <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => setToDelete(s)}>
        <Trash2 size={14} /> Delete
      </Button>
    </div>
  );

  const columns: Column<Service>[] = [
    {
      key: "image",
      header: "Image",
      render: (s) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={s.image} alt={s.serviceName} className="h-12 w-12 rounded-lg object-cover" />
      ),
    },
    { key: "name", header: "Service Name", render: (s) => <p className="max-w-[220px] truncate font-semibold">{s.serviceName}</p> },
    { key: "category", header: "Category", render: (s) => <span className="text-[#82736C]">{s.category}</span> },
    { key: "price", header: "Price", render: (s) => <span className="font-semibold">{formatPrice(s.price)}</span> },
    { key: "duration", header: "Duration", render: (s) => <span className="whitespace-nowrap">{formatDuration(s.duration)}</span> },
    { key: "status", header: "Status", render: (s) => <StatusBadge status={s.status} /> },
    { key: "actions", header: "Actions", render: actions },
  ];

  return (
    <div>
      <PageHeader
        title="Manage Services"
        description="Add, update, activate or remove salon services."
        action={
          <Link href="/dashboard/services/new">
            <Button><Plus size={16} /> Add Service</Button>
          </Link>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#82736C]" />
          <input
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
            placeholder="Search by service name"
            className={`${inputClass} pl-10`}
          />
        </div>

        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className={inputClass}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={status} onChange={(e) => { setStatus(e.target.value as ServiceStatus | ""); setPage(1); }} className={inputClass}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select value={sort} onChange={(e) => { setSort(e.target.value as PriceSort); setPage(1); }} className={inputClass}>
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
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
              rowKey={(s) => s._id}
              loading={loading}
              empty={
                <EmptyState
                  icon={<Scissors size={26} />}
                  title="No services found"
                  description="Add your first salon service or change the filters."
                  action={<Link href="/dashboard/services/new"><Button>Add Service</Button></Link>}
                />
              }
              mobileCard={(s) => (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#49342D]">{s.serviceName}</p>
                      <p className="text-xs text-[#82736C]">{s.category} · {formatDuration(s.duration)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#49342D]">{formatPrice(s.price)}</p>
                      <StatusBadge status={s.status} />
                    </div>
                  </div>
                  {actions(s)}
                </div>
              )}
            />
            <Pagination pagination={data?.pagination} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete this service?"
        description={`"${toDelete?.serviceName ?? ""}" will be permanently deleted. Services with pending or confirmed appointments cannot be deleted; deactivate them instead.`}
        confirmLabel="Delete service"
        tone="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}

export default function ManageServices() {
  return (
    <RequireRole role="admin">
      <Manage />
    </RequireRole>
  );
}
