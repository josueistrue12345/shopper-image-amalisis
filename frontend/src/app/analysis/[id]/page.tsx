"use client";

import { Icon } from "@/components/Icon";
import { AnalysisResult, ImageResult } from "@/models/analysis";
import { Checklist, Unit } from "@/models/checklist";
import { imageSrc } from "@/utils/evidences";
import { cleanText, toTitle } from "@/utils/text";
import { getDate } from "@/utils/time";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getAnalysisColor } from "@/utils/analysis";

export default function Detalle() {
  const params = useParams();
  const router = useRouter();

  const [data, setData] = useState<AnalysisResult>();
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [expandedDetail, setExpandedDetail] = useState<string | null>(null);
  const [imageModal, setImageModal] = useState<{
    src: string;
    details: string;
  } | null>(null);
  const [repliesInfo, setRepliesInfo] = useState<
    Record<string, { replie: Checklist; store: Unit }>
  >({});

  const loadData = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const res = await axios.get("/api/analysis/" + params.id);
        setData(res.data);

        const replieIds = (res.data as AnalysisResult).image_results
          .map((img) => img.image.replie)
          .filter((id) => id);

        if (replieIds.length > 0) {
          const uniqueIds = [
            ...new Set(replieIds.filter((id) => id && !repliesInfo[id])),
          ];
          if (uniqueIds.length > 0) {
            const repliesRes = await axios.get("/api/replies", {
              params: { ids: uniqueIds.join(",") },
            });
            setRepliesInfo((prev) => ({ ...prev, ...repliesRes.data }));
          }
        }
      } catch (error) {
        console.error(error);
      }
      if (showLoading) setLoading(false);
    },
    [params.id]
  );

  const handleWebSocketMessage = useCallback(
    (message: any) => {
      if (message) {
        loadData();
      }
    },
    [data]
  );

  useWebSocket({
    url: `${process.env.NEXT_PUBLIC_WS_URL}/ws/${params.id}`,
    onMessage: handleWebSocketMessage,
    enabled: data?.status === "procesando",
  });

  useEffect(() => {
    loadData(true);
  }, [params.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = () => handleClickOutside();
    if (expandedDetail) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [expandedDetail]);

  const getDuration = (start: string, end?: string) => {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : currentTime;
    const diff = Math.floor((endTime - startTime) / 1000);

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    if (days > 0) {
      return `${days} día${days !== 1 ? "s" : ""} ${hours} hora${
        hours !== 1 ? "s" : ""
      }`;
    }
    if (hours > 0) {
      return `${hours} hora${hours !== 1 ? "s" : ""} ${minutes} minuto${
        minutes !== 1 ? "s" : ""
      }`;
    }
    if (minutes > 0) {
      return `${minutes} minuto${minutes !== 1 ? "s" : ""} ${seconds} segundo${
        seconds !== 1 ? "s" : ""
      }`;
    }
    return `${seconds} segundo${seconds !== 1 ? "s" : ""}`;
  };

  const getGroups = (results: ImageResult[]) => {
    const grouped = results.reduce((acc, imageResult) => {
      const replie = imageResult.image.replie || "";
      if (!acc[replie]) acc[replie] = [];
      acc[replie].push(imageResult);
      return acc;
    }, {} as Record<string, ImageResult[]>);

    return grouped;
  };

  const handleDetailClick = (detail: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedDetail(detail);
  };

  const handleClickOutside = () => {
    setExpandedDetail(null);
  };

  const handleImageClick = (imageSrc: string, details: string) => {
    setImageModal({ src: imageSrc, details });
  };

  const closeImageModal = () => {
    setImageModal(null);
  };

  const getReplieInfo = (replieId: string) => {
    const info = repliesInfo[replieId];
    if (!replieId || !info) return;
    return info;
  };

  return (
    <main className="flex w-full h-screen overflow-auto flex-col">
      <header className="flex items-center px-8 py-4 gap-6">
        <h1 className="text-xl w-full">Detalle del análisis</h1>
        <Link
          onClick={router.back}
          href={""}
          className="min-w-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-current/10"
        >
          <Icon name="close" />
        </Link>
      </header>
      <section className="flex h-full flex-col gap-4 pt-4 px-8 pb-10">
        {loading && (
          <div className="py-1">
            <div className="shimmer gray rounded h-10 w-80"></div>
            <div className="flex gap-4 mt-4">
              <div className="shimmer gray rounded h-5 w-30"></div>
              <div className="shimmer gray rounded h-5 w-30"></div>
            </div>
            <div className="flex gap-4 mt-6">
              <div className="shimmer gray rounded h-16 w-full"></div>
              <div className="shimmer gray rounded h-16 w-full"></div>
              <div className="shimmer gray rounded h-16 w-full"></div>
            </div>
          </div>
        )}
        {!loading && !data && (
          <div className="py-6 gap-2 flex flex-col items-center w-full">
            <Icon
              name="error"
              className="text-red-700 dark:text-red-400"
              size={48}
            />
            <h1 className="text-lg text-current/80">
              No se encontró el detalle de este análisis
            </h1>
          </div>
        )}
        {data && !loading && (
          <div className="w-full pb-6">
            <h2 className="text-xl text-current/80">
              {getDate(data.createdAt)}
            </h2>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-current/60">
                <Icon name="image" size={20} />
                <span>
                  {data.total_images} imagen{data.total_images != 1 ? "es" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1 text-current/60">
                <Icon name="pending" size={20} />
                <span>
                  {data.total_rules} regla{data.total_rules != 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 w-full">
              <div
                className={`w-full flex flex-col items-center py-3 px-6 gap-1 rounded-lg overflow-hidden ${getAnalysisColor(
                  data.status
                )}`}
              >
                <span className="text-xs text-current/50">Estado</span>
                <p className="text-md">{toTitle(data.status)}</p>
              </div>
              <div className="relative w-full flex flex-col items-center py-3 px-6 gap-1 bg-white dark:bg-zinc-800 rounded-lg overflow-hidden">
                <div
                  className="z-0 bg-sky-200 dark:bg-sky-800 h-full absolute left-0 top-0 transition-all duration-300"
                  style={{ width: `${data.progress}%` }}
                ></div>
                {data.status === "procesando" && data.progress < 100 && (
                  <div
                    className="z-0 h-full absolute top-0"
                    style={{
                      left: `${data.progress}%`,
                      width: `${100 - data.progress}%`,
                    }}
                  >
                    <div className="h-full w-100 opacity-30 bg-gradient-to-r from-sky-200 dark:from-sky-800 dark:via-zinc-700/50 via-white/50 to-sky-200 dark:to-sky-800 bg-[length:200%_100%] shimmer"></div>
                  </div>
                )}
                <span className="z-10 relative text-xs text-current/50">
                  Progreso
                </span>
                <p className="z-10 relative text-md">{data.progress}%</p>
              </div>
              <div className="w-full flex flex-col items-center py-3 px-6 gap-1 bg-white dark:bg-zinc-800 rounded-lg overflow-hidden">
                <span className="text-xs text-current/50">Duración</span>
                <p className="text-md">
                  {getDuration(data.createdAt, data.completedAt)}
                </p>
              </div>
            </div>

            <h2 className="text-xl text-current/80 mt-6 mb-2">Resultados</h2>
            {data.error && (
              <div className="flex items-center gap-2">
                <Icon name="error" className="text-red-700" size={24} />
                <p className="w-full opacity-70">{data.error}</p>
              </div>
            )}

            {Object.entries(getGroups(data.image_results)).map(
              ([replie, results]) => (
                <div
                  key={replie}
                  className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-current/20 mb-4"
                >
                  <div className="flex gap-2 items-center mb-4">
                    <div className="w-full">
                      <h3 className="text-lg font-medium">
                        {getReplieInfo(replie)?.replie.title ||
                          "Sin formulario"}
                      </h3>
                      {getReplieInfo(replie) && (
                        <p className="text-xs text-current/70">
                          Respuesta{" "}
                          {getDate(getReplieInfo(replie)?.replie.dateApplyed)}
                        </p>
                      )}
                    </div>
                    {getReplieInfo(replie) && (
                      <div className="min-w-max flex items-center gap-1">
                        <Icon name="store" />
                        <span>{getReplieInfo(replie)?.store.name}</span>
                        <span className="text-current/70">
                          T{getReplieInfo(replie)?.store.storeCode}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {results.map((imageResult, idx) => (
                      <div key={idx} className="flex w-full gap-2">
                        <img
                          alt={imageResult.image.name}
                          className="aspect-square h-48 object-cover bg-current/10 cursor-pointer hover:opacity-80 transition-opacity"
                          src={imageSrc(imageResult.image.path)}
                          onClick={() =>
                            handleImageClick(
                              imageSrc(imageResult.image.path),
                              imageResult.rule_results
                                .map((r) => r.details)
                                .join(" ")
                            )
                          }
                        />
                        <div className="flex flex-col w-full gap-2">
                          {imageResult.rule_results.map((rule, ruleIdx) => (
                            <div key={ruleIdx} className="flex px-2 flex-col">
                              <div className="flex items-center gap-2">
                                <Icon
                                  name={
                                    rule.complies ? "check_circle" : "cancel"
                                  }
                                  filled
                                  className={
                                    rule.complies
                                      ? "text-green-600"
                                      : "text-red-700"
                                  }
                                  size={24}
                                />
                                <h4 className="w-full">
                                  {rule.name || `Regla ${rule.rule_id}`}
                                </h4>
                                <span className="text-xs min-w-max px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">
                                  Precisión: {rule.accuraccy * 100}%
                                </span>
                              </div>
                              <div className="relative">
                                <p
                                  className="cursor-pointer text-current/70 text-sm mt-2 line-clamp-3 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg p-1"
                                  onClick={(e) =>
                                    handleDetailClick(rule.details, e)
                                  }
                                >
                                  {cleanText(rule.details)}
                                </p>
                                {expandedDetail === rule.details && (
                                  <div
                                    className="absolute top-2 left-0 right-0 bg-gray-100 dark:bg-zinc-700 rounded-lg p-2 shadow-lg z-10 text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {cleanText(rule.details)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {imageModal && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageModal.src}
              alt="Preview"
              className="max-w-full h-full object-contain"
            />
            <button
              onClick={closeImageModal}
              className="absolute cursor-pointer top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <Icon name="close" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/0 px-16 py-12 overflow-hidden">
              <p className="text-white text-sm line-clamp-3">
                {cleanText(imageModal.details)}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
