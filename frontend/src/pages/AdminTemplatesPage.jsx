import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../queries/auth";
import { useTemplate, useUpdateTemplate } from "../queries/templates";
import { AdminLayout } from "../components/layout/AdminLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Label } from "../components/ui/Label";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { useConfirm } from "../components/ui/ConfirmProvider.jsx";
import {
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Clipboard,
  Check,
  Info,
} from "lucide-react";
import { useDocumentTitle } from "../utils/useDocumentTitle.js";

export default function AdminTemplatesPage() {
  const { add: addToast } = useToast();
  const { confirm } = useConfirm();
  const navigate = useNavigate();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { data, isLoading } = useTemplate();
  const updateMutation = useUpdateTemplate();

  useDocumentTitle("Template Pesan");

  const NAME_PLACEHOLDER = "{name}";
  const QUOTE_PLACEHOLDER = "{quote}";

  const [template, setTemplate] = useState("");
  const [activeTab, setActiveTab] = useState("template"); // 'template' | 'preview'
  const [filterName, setFilterName] = useState("");
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef(null);

  const preview = useMemo(
    () =>
      (template || "")
        .replaceAll(NAME_PLACEHOLDER, filterName || "Nama")
        .replaceAll(QUOTE_PLACEHOLDER, "Kutipan hari ini"),
    [template, filterName]
  );

  const isDirty = useMemo(() => {
    const server = data?.template ?? "";
    return template !== server;
  }, [template, data?.template]);

  // Hotkey: Cmd/Ctrl+S untuk simpan
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (!updateMutation.isLoading) handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, updateMutation.isLoading]);

  useEffect(() => {
    if (!sessionLoading && !session?.authenticated) {
      navigate("/admin/login", { replace: true });
    }
  }, [session, sessionLoading, navigate]);

  useEffect(() => {
    if (data?.template !== undefined) setTemplate(data.template);
  }, [data]);

  const insertAtCursor = (text) => {
    const el = textareaRef.current;
    if (!el) {
      setTemplate((t) => (t ?? "") + text);
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + text + el.value.slice(end);
    setTemplate(next);
    // pindahkan kursor setelah text yang disisipkan
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleSave = (e) => {
    e?.preventDefault?.();
    updateMutation.mutate(template, {
      onSuccess: () =>
        addToast("Template berhasil disimpan.", { type: "success" }),
      onError: (err) =>
        addToast(err?.message || "Gagal menyimpan template.", {
          type: "error",
        }),
    });
  };

  const PlaceholderChip = ({ token, label }) => (
    <button
      type="button"
      onClick={() => insertAtCursor(token)}
      className="
        inline-flex items-center gap-1 rounded-md
        border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200
        hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/60
      "
      title={`Sisipkan ${token}`}
    >
      <code>{token}</code> <span className="opacity-70">({label})</span>
    </button>
  );

  const PreviewText = () => {
    // highlight curly placeholders pada preview (jika masih ada)
    const parts = preview.split(/(\{[^}]+\})/g);
    return (
      <div className="min-h-[260px] whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-950/70 p-4 text-slate-200">
        {parts.map((p, i) =>
          /^\{[^}]+\}$/.test(p) ? (
            <mark
              key={i}
              className="rounded bg-amber-500/20 px-1 py-0.5 text-amber-200"
            >
              {p}
            </mark>
          ) : (
            <span key={i}>{p}</span>
          )
        )}
      </div>
    );
  };

  return (
    <AdminLayout username={session?.user?.username} loading={sessionLoading}>
      <div className="space-y-8">
        <Card className="space-y-6 border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-800/70 p-6 backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-white">
                Pengaturan Template Pesan
              </h1>
              <p className="text-sm text-slate-400">
                Gunakan placeholder <code>{NAME_PLACEHOLDER}</code> untuk nama
                penerima dan <code>{QUOTE_PLACEHOLDER}</code> untuk kutipan
                harian.
              </p>
            </div>

            {/* State bar */}
            <div className="flex items-center gap-2">
              {isDirty ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-100">
                  <Info className="h-3.5 w-3.5" /> Perubahan belum disimpan
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-100">
                  <Check className="h-3.5 w-3.5" /> Tersimpan
                </span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-3 text-slate-300">
              <Spinner /> Memuat template...
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Tabs */}
              <div className="inline-flex w-full items-center gap-1 rounded-xl border border-white/10 bg-slate-950/60 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setActiveTab("template")}
                  className={
                    activeTab === "template"
                      ? "flex-1 rounded-lg bg-primary-500/20 px-4 py-2 font-semibold text-white shadow-inner shadow-primary-500/20"
                      : "flex-1 rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <EyeOff className="h-4 w-4" /> Template
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={
                    activeTab === "preview"
                      ? "flex-1 rounded-lg bg-primary-500/20 px-4 py-2 font-semibold text-white shadow-inner shadow-primary-500/20"
                      : "flex-1 rounded-lg px-4 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <Eye className="h-4 w-4" /> Pratinjau
                  </span>
                </button>
              </div>

              {activeTab === "template" ? (
                <div className="space-y-4">
                  {/* Toolbar placeholder */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400">Sisipkan:</span>
                    <PlaceholderChip token={NAME_PLACEHOLDER} label="Nama" />
                    <PlaceholderChip
                      token={QUOTE_PLACEHOLDER}
                      label="Kutipan"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template">Template</Label>
                    <textarea
                      id="template"
                      ref={textareaRef}
                      className="min-h-[260px] w-full resize-vertical rounded-xl border border-white/10 bg-slate-950/70 p-4 text-slate-100 shadow-inner shadow-black/20 focus:border-primary-500 focus:outline-none focus:ring focus:ring-primary-500/20"
                      value={template}
                      onChange={(e) => setTemplate(e.target.value)}
                      placeholder={`Contoh:\nHalo ${NAME_PLACEHOLDER},\n${QUOTE_PLACEHOLDER}\nSemoga harimu menyenangkan!`}
                    />
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>
                        {template.length} karakter •{" "}
                        {template.split(/\n/).length} baris
                      </span>
                      <span className="opacity-80">
                        Ctrl/Cmd + S untuk simpan
                      </span>
                    </div>
                    {updateMutation.error ? (
                      <p className="text-sm text-rose-300">
                        {updateMutation.error.message}
                      </p>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="ml-auto flex gap-2">
                      {/* Reset */}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={async () => {
                          const ok = await confirm({
                            title: "Reset template?",
                            message: "Kembalikan ke versi tersimpan.",
                            confirmText: "Ya, reset",
                            variant: "warning",
                          });
                          if (!ok) return;
                          setTemplate(data?.template || "");
                          addToast("Perubahan template direset.", {
                            type: "info",
                          });
                        }}
                        className="inline-flex items-center gap-2 rounded-lg"
                        disabled={!isDirty || updateMutation.isLoading}
                        title="Reset"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </Button>

                      {/* Simpan */}
                      <Button
                        type="submit"
                        disabled={updateMutation.isLoading || !isDirty}
                        className="
        inline-flex items-center gap-2 rounded-lg px-4 py-2
        bg-sky-600 text-on-accent hover:bg-sky-500
        border border-sky-400/30 shadow-lg shadow-sky-600/20
        disabled:opacity-60
      "
                        title="Simpan"
                      >
                        {updateMutation.isLoading ? (
                          "Menyimpan..."
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Simpan
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {updateMutation.isSuccess && !isDirty ? (
                    <p className="text-sm text-emerald-300">
                      Template berhasil disimpan.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Pratinjau</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Coba nama…"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className="h-8 w-40 rounded-lg border-white/10 bg-slate-950/70 px-3 py-1 text-sm"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(preview);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1200);
                          } catch {
                            addToast("Gagal menyalin.", { type: "error" });
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-lg h-8 px-3"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Clipboard className="h-4 w-4" />
                        )}
                        {copied ? "Tersalin" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  <PreviewText />
                </div>
              )}
            </form>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
