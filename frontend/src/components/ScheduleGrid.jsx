import { Label } from "./ui/Label";
import { Clock } from "./ui/icons";
import { Input } from "./ui/Input";
import { Skeleton } from "./ui/Skeleton";
import { DataPlaceholder } from "./ui/DataPlaceholder";

const dayLabels = {
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
  7: "Minggu",
};

export function ScheduleGrid({
  values,
  onChange,
  readOnly = false,
  loading = false,
  timeSuffix,
}) {
  // Loading state
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );
  }

  // Data belum ada saat editable
  if (!readOnly && !values) {
    return (
      <DataPlaceholder
        icon={<Clock size={24} />}
        title="Belum ada jadwal"
        description="Atur jadwal harian terlebih dahulu untuk mengaktifkan pengiriman otomatis."
      />
    );
  }

  // Grid utama
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Object.entries(dayLabels).map(([day, label]) => {
        const value = values?.[day] ?? "";

        return (
          <div
            key={day}
            className={`flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-inner shadow-black/20 ${
              !readOnly
                ? "transition hover:border-primary-400/40 hover:shadow-md"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary-400" />
              <Label htmlFor={readOnly ? undefined : `day-${day}`}>
                {label}
              </Label>
            </div>

            {readOnly ? (
              <p className="text-lg font-semibold text-white">
                {value
                  ? `${value}${timeSuffix ? ` ${timeSuffix}` : ""}`
                  : Number(day) >= 6
                  ? "Libur"
                  : "Tidak dijadwalkan"}
              </p>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  id={`day-${day}`}
                  type="time"
                  value={value || ""}
                  onChange={(event) =>
                    onChange({
                      ...values,
                      [day]: event.target.value || null,
                    })
                  }
                />
                {timeSuffix ? (
                  <span className="text-sm font-medium text-slate-400">{timeSuffix}</span>
                ) : null}
              </div>
            )}

            {!readOnly && (
              <p className="text-xs text-slate-500">
                Kosongkan jika tidak ingin menjadwalkan pengiriman pada hari
                ini.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}



