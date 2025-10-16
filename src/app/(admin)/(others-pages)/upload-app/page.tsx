"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function UploadAppVersion() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(2) + " KB";
    const mb = kb / 1024;
    if (mb < 1024) return mb.toFixed(2) + " MB";
    const gb = mb / 1024;
    return gb.toFixed(2) + " GB";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez sélectionner un fichier à uploader.");
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData(e.currentTarget);
    formData.append("file", file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload-app-version"); // ton endpoint

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        setLoading(false);
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            toast.success("Version uploadée avec succès !");
            e.currentTarget.reset();
            setFile(null);
            setProgress(0);
          } else {
            toast.error(response.error || "Erreur lors de l'upload.");
          }
        } else {
          toast.error("Erreur lors de l'upload.");
        }
      };

      xhr.onerror = () => {
        setLoading(false);
        toast.error("Erreur lors de l'upload.");
      };

      xhr.send(formData);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Erreur lors de l'upload.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Uploader une nouvelle version</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          name="os"
          placeholder="OS (Windows/macOS/Linux)"
          className="input w-full"
          required
        />
        <input
          name="version"
          placeholder="Version (ex: 2.0.1)"
          className="input w-full"
          required
        />
        <input
          name="cpu_requirement"
          placeholder="CPU requirement"
          className="input w-full"
          required
        />
        <input
          name="ram_requirement"
          placeholder="RAM requirement"
          className="input w-full"
          required
        />
        <input
          name="storage_requirement"
          placeholder="Storage requirement"
          className="input w-full"
          required
        />
        <input
          name="size"
          type="number"
          placeholder="Taille en octets"
          className="input w-full"
          required
        />

        {/* Drag & Drop */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
            dragActive ? "border-primary bg-primary/10" : "border-muted"
          }`}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".exe,.dmg,.deb,.rpm"
            onChange={handleFileChange}
          />
          {file ? (
            <p className="text-sm">
              {file.name} ({formatSize(file.size)})
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Glissez-déposez le fichier ici ou cliquez pour sélectionner
            </p>
          )}
        </div>

        {/* Progression */}
        {loading && (
          <div className="w-full bg-muted/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-3 transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? `Upload ${progress}%` : "Uploader"}
        </button>
      </form>
    </div>
  );
}
