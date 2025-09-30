import { Pencil, Trash2 } from "lucide-react";
import { ContactStatusBadge } from "./ContactStatusBadge";
import { Button } from "./ui/Button";
import { DataPlaceholder } from "./ui/DataPlaceholder";

function formatStatusLabel(status) {
  if (!status) return "";
  return status
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ContactTable({
  contacts = [],
  allowedStatuses = [],
  onEdit,
  onDelete,
  onStatusChange,
  statusUpdatingId,
  isStatusUpdating = false,
}) {
  if (!contacts.length) {
    return (
      <DataPlaceholder
        icon="📇"
        title="Belum ada kontak"
        description="Tambahkan kontak pegawai untuk mengatur penerima pesan pengingat."
      />
    );
  }

  const sorted = [...contacts].sort((a, b) =>
    a.name.localeCompare(b.name, "id", { sensitivity: "base" })
  );

  const options = allowedStatuses.length
    ? allowedStatuses
    : [...new Set(contacts.map((c) => c.status))];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 [.theme-dark_&]:border-white/10">
      <div className="max-h-[520px] overflow-auto">
        <table className="min-w-full text-sm divide-y divide-slate-200/60 [.theme-dark_&]:divide-white/10">
          <thead
            className="text-xs uppercase tracking-wide bg-white/90 text-slate-600
                              [.theme-dark_&]:bg-slate-900/80 [.theme-dark_&]:text-slate-400 text-center"
          >
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Nomor WhatsApp</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/60 [.theme-dark_&]:divide-white/10">
            {sorted.map((contact) => {
              const disableRow =
                isStatusUpdating && statusUpdatingId === contact.id;

              return (
                <tr
                  key={contact.id}
                  className="group transition
                            bg-white text-slate-700 hover:bg-slate-50
                            [.theme-dark_&]:bg-slate-900/50 [.theme-dark_&]:text-slate-200 [.theme-dark_&]:hover:bg-slate-900/70"
                >
                  <td className="px-4 py-3 font-medium text-slate-900 [.theme-dark_&]:text-white">
                    {contact.name}
                  </td>

                  {/* Nomor WA: terang di dark, tegas di light */}
                  <td className="px-4 py-3">
                    <span
                      className="
                        font-mono text-sm tracking-wide
                        text-slate-800
                        [.theme-dark_&]:text-slate-100
                      "
                    >
                      {contact.number}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <ContactStatusBadge status={contact.status} />
                      <select
                        className="rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-inner
                                  border border-slate-300 bg-white/70 text-slate-700 shadow-black/5
                                  focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-500/20 disabled:opacity-60
                                  [.theme-dark_&]:border-white/10 [.theme-dark_&]:bg-slate-950/70
                                  [.theme-dark_&]:text-slate-200 [.theme-dark_&]:shadow-black/30"
                        value={contact.status}
                        disabled={disableRow}
                        onChange={(event) => {
                          const nextStatus = event.target.value;
                          if (nextStatus !== contact.status) {
                            onStatusChange?.(contact.id, nextStatus);
                          }
                        }}
                        aria-label={`Ubah status ${contact.name ?? "kontak"}`}
                      >
                        {options.map((status) => (
                          <option key={status} value={status}>
                            {formatStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-end gap-1.5">
                      {/* Edit */}
                      <Button
                        variant="secondary"
                        outline
                        iconOnly
                        onClick={() => onEdit?.(contact)}
                        aria-label={`Edit ${contact.name ?? "kontak"}`}
                        title="Edit"
                        className="focus-visible:ring-sky-300/60"
                      >
                        <Pencil className="h-5 w-5" />{" "}
                        {/* biarkan ikut currentColor */}
                      </Button>

                      {/* Hapus */}
                      <Button
                        variant="danger"
                        outline
                        iconOnly
                        onClick={() => onDelete?.(contact)}
                        aria-label={`Hapus ${contact.name ?? "kontak"}`}
                        title="Hapus"
                        className="hover:bg-rose-500/10 focus-visible:ring-rose-300/60"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
