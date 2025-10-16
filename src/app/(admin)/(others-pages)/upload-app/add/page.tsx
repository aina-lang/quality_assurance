"use client";
import { useState } from "react";
import { Cloud, Upload, Check, AlertCircle } from "lucide-react";
import { formatSize } from "@/app/lib/types";

export default function UploadAppVersion() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);
  const [formData, setFormData] = useState({
    os: "",
    version: "",
    cpu_requirement: "",
    ram_requirement: "",
    storage_requirement: "",
    size: "", // stocke la taille du fichier
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFormData((prev) => ({ ...prev, size: droppedFile.size.toString() }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFormData((prev) => ({ ...prev, size: selectedFile.size.toString() }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setNotification({ type: "error", message: "Veuillez sélectionner un fichier à uploader." });
      setTimeout(() => setNotification(null), 4000);
      return;
    }

    setLoading(true);
    setProgress(0);

    const formDataObj = new FormData();
    formDataObj.append("os", formData.os);
    formDataObj.append("version", formData.version);
    formDataObj.append("cpu_requirement", formData.cpu_requirement);
    formDataObj.append("ram_requirement", formData.ram_requirement);
    formDataObj.append("storage_requirement", formData.storage_requirement);
    formDataObj.append("size", formData.size);
    formDataObj.append("file", file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload-app");

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
            setNotification({ type: "success", message: "Version uploadée avec succès !" });
            setFile(null);
            setProgress(0);
            setFormData({
              os: "",
              version: "",
              cpu_requirement: "",
              ram_requirement: "",
              storage_requirement: "",
              size: "",
            });
            setTimeout(() => setNotification(null), 4000);
          } else {
            setNotification({ type: "error", message: response.error || "Erreur lors de l'upload." });
            setTimeout(() => setNotification(null), 4000);
          }
        } else {
          setNotification({ type: "error", message: "Erreur lors de l'upload." });
          setTimeout(() => setNotification(null), 4000);
        }
      };

      xhr.onerror = () => {
        setLoading(false);
        setNotification({ type: "error", message: "Erreur lors de l'upload." });
        setTimeout(() => setNotification(null), 4000);
      };

      xhr.send(formDataObj);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setNotification({ type: "error", message: "Erreur lors de l'upload." });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4">
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-xl backdrop-blur-md border shadow-lg ${
              notification.type === "success"
                ? "bg-emerald-100 border-emerald-500 text-emerald-700"
                : "bg-red-100 border-red-500 text-red-700"
            }`}
          >
            {notification.type === "success" ? <Check size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Cloud className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Uploader une Version
              </h1>
              <p className="text-gray-500 text-sm mt-1">Déployez une nouvelle version de votre application</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Input Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* OS Dropdown */}
            <select
              name="os"
              value={formData.os}
              onChange={handleInputChange}
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              required
            >
              <option value="">Sélectionnez OS</option>
              <option value="Windows">Windows</option>
              <option value="macOS">macOS</option>
              <option value="Linux">Linux</option>
            </select>

            <input
              name="version"
              value={formData.version}
              onChange={handleInputChange}
              placeholder="Version (ex: 2.0.1)"
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              name="cpu_requirement"
              value={formData.cpu_requirement}
              onChange={handleInputChange}
              placeholder="CPU"
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              required
            />
            <input
              name="ram_requirement"
              value={formData.ram_requirement}
              onChange={handleInputChange}
              placeholder="RAM"
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              required
            />
            <input
              name="storage_requirement"
              value={formData.storage_requirement}
              onChange={handleInputChange}
              placeholder="Stockage"
              className="px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
              required
            />
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
              dragActive
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400"
            }`}
            onClick={() => document.getElementById("fileInput")?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept=".exe,.dmg,.deb,.rpm"
              onChange={handleFileChange}
            />

            {file ? (
              <div className="space-y-2">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <Upload className="text-white" size={24} />
                  </div>
                </div>
                <p className="text-gray-900 font-semibold">{file.name}</p>
                <p className="text-gray-500 text-sm">{formatSize(file.size)}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center mb-2">
                  <div className="p-3 bg-gray-200 rounded-xl">
                    <Upload className="text-gray-400" size={24} />
                  </div>
                </div>
                <p className="text-gray-900 font-medium">Glissez-déposez votre fichier ici</p>
                <p className="text-gray-500 text-sm">ou cliquez pour sélectionner</p>
                <p className="text-gray-400 text-xs mt-2">Formats acceptés: .exe, .dmg, .deb, .rpm</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Upload en cours...</p>
                <span className="text-sm font-semibold text-blue-500">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin" />
                Upload {progress}%
              </>
            ) : (
              <>
                <Cloud size={20} />
                Uploader la Version
              </>
            )}
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-gray-500 text-sm text-center">
            Assurez-vous que tous les détails sont corrects avant de soumettre. Votre fichier sera validé avant le déploiement.
          </p>
        </div>
      </div>
    </div>
  );
}
