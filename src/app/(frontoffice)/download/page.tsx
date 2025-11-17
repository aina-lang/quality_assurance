"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, Monitor, Smartphone, Tablet, Cpu, MemoryStick, HardDrive, CheckCircle, FileText, Shield, Zap, User, Lock } from "lucide-react";
import Link from "next/link";
import { getAppVersions } from "@/app/actions/backoffice";
import Swal from "sweetalert2";
import { formatSize } from "@/app/lib/types";




export default function DownloadPage() {
  const [versions, setVersions] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Charger les versions depuis la base
  useEffect(() => {
    async function loadVersions() {
      try {
        const res = await getAppVersions();
        console.log(res);

        setVersions(res);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load versions.");
      }
    }
    loadVersions();
  }, []);

  const handleDownload = async (platform: string, fileUrl: string) => {
    try {
      toast.info(`Preparing the ${platform} download...`);

      // Extract key from the public URL when needed
      let fileKey = fileUrl;
      if (fileUrl.startsWith("http")) {
        const parts = fileUrl.split(".com/");
        fileKey = parts[1]; // ex: "app-versions/1761751185439-quality-assurance-1.0.0-setup.exe"
      }

      const res = await fetch(`/api/download?file=${encodeURIComponent(fileKey)}`);
      if (!res.ok) throw new Error("Could not generate a download link.");

      const data = await res.json();

      if (data.downloadUrl) {
        toast.success(`${platform} download started!`);
        window.open(data.downloadUrl, "_blank");
        Swal.fire({
          icon: "success",
          title: `${platform} download started!`,
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Download link not found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unable to download this version.");
      Swal.fire({
        icon: "error",
        title: "Download error",
        text: "Please try again later.",
      });
    }
  };


  // Icons per operating system
  const getIcon = (os: string) => {
    if (os.toLowerCase().includes("windows")) return <Monitor className="h-12 w-12" />;
    if (os.toLowerCase().includes("mac")) return <Smartphone className="h-12 w-12" />;
    if (os.toLowerCase().includes("linux")) return <Tablet className="h-12 w-12" />;
    return <Monitor className="h-12 w-12" />;
  };

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-wider">
            <span className="text-brand-500">Download</span><br />
            <span className="text-muted-foreground">Quality Assurance</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Install Quality Assurance Pro on your favorite platform — Windows, macOS, or Linux.
          </p>
        </div>
      </section>

      {/* Versions dynamiques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {versions.length === 0 ? (
          <p className="text-center text-muted-foreground">No versions available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {versions.map((v) => (
              <Card key={v.id} className="hover:shadow-lg transition-all">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {getIcon(v.os)}
                  </div>
                  <CardTitle className="text-2xl">{v.os}</CardTitle>
                  <CardDescription className="text-base">{v.requirements_os || "System requirements"}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Version:</span>
                      <Badge variant="secondary">{v.version}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Size:</span>
                      <span className="text-sm">{formatSize(v.size)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Requirements:</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2"><Cpu className="h-3 w-3" /> <span>{v.cpu_requirement}</span></div>
                      <div className="flex items-center space-x-2"><MemoryStick className="h-3 w-3" /> <span>{v.ram_requirement}</span></div>
                      <div className="flex items-center space-x-2"><HardDrive className="h-3 w-3" /> <span>{v.storage_requirement}</span></div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={() => handleDownload(v.os, v.file_key || v.download_link)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download for {v.os}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">Don’t have an account yet?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Create your free account and start improving quality operations today.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/subscription">
                  <Lock className="mr-2 h-5 w-5" />
                  Create a free account
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
