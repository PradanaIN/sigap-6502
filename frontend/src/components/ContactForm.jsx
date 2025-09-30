import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

const DEFAULT_VALUES = {
  name: "",
  number: "",
  status: "masuk",
};

function normalizeStatusOptions(options) {
  if (!Array.isArray(options) || !options.length) {
    return ["masuk"];
  }
  return options;
}

function formatStatusLabel(status) {
  if (!status) return "";
  return status
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ContactForm({
  allowedStatuses = ["masuk"],
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Simpan",
  title = "Kontak",
  description,
  errorMessage,
  /** ⬇️ Tambahan baru */
  formId = "contact-form",
  hideActions = false,
}) {
  const normalizedStatuses = normalizeStatusOptions(allowedStatuses);
  const [values, setValues] = useState({
    ...DEFAULT_VALUES,
    status: normalizedStatuses[0],
  });

  const hasInitialValues = Boolean(initialValues);
  const initialName = initialValues?.name ?? "";
  const initialNumber = initialValues?.number ?? "";
  const initialStatus = initialValues?.status;
  const defaultStatus = normalizedStatuses[0];

  useEffect(() => {
    if (hasInitialValues) {
      setValues((prev) => ({
        ...prev,
        name: initialName,
        number: initialNumber,
        status: initialStatus || defaultStatus,
      }));
    } else {
      setValues({ ...DEFAULT_VALUES, status: defaultStatus });
    }
  }, [
    hasInitialValues,
    initialName,
    initialNumber,
    initialStatus,
    defaultStatus,
  ]);

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(values);
  };

  return (
    <Card className="space-y-5 border-white/10 bg-slate-900/70 p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {description ? (
          <p className="text-sm text-slate-400">{description}</p>
        ) : null}
      </div>

      {/* ⬇️ Beri id agar bisa di-trigger tombol footer modal via form="..." */}
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Nama Lengkap</Label>
          <Input
            id="contact-name"
            value={values.name}
            onChange={handleChange("name")}
            required
            placeholder="Nama pegawai"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-number">Nomor WhatsApp</Label>
          <Input
            id="contact-number"
            type="tel"
            value={values.number}
            onChange={handleChange("number")}
            required
            placeholder="62xxxxxxxxxx"
            aria-describedby="wa-help"
          />
          <p id="wa-help" className="text-xs text-slate-500">
            Gunakan format internasional tanpa spasi, contoh: 6281xxxxxx.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-status">Status</Label>
          <select
            id="contact-status"
            className="
              w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm
              font-medium uppercase tracking-wide text-slate-200 shadow-inner shadow-black/30
              focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-500/20
              [.theme-dark_&]:border-white/10
            "
            value={values.status}
            onChange={handleChange("status")}
          >
            {normalizedStatuses.map((status) => (
              <option key={status} value={status}>
                {formatStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {errorMessage ? (
          <p className="text-sm text-rose-300">{errorMessage}</p>
        ) : null}

        {/* ⬇️ Sembunyikan aksi internal jika kita pakai footer modal */}
        {!hideActions && (
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : submitLabel}
            </Button>
            {onCancel ? (
              <Button
                type="button"
                variant="danger"
                outline
                onClick={() => onCancel?.()}
                disabled={isSubmitting}
              >
                Batal
              </Button>
            ) : null}
          </div>
        )}
      </form>
    </Card>
  );
}
