"use client";

import { Icon } from "@/components/Icon";
import { AnalysisResult } from "@/models/analysis";
import { getAnalysisColor } from "@/utils/analysis";
import { toTitle } from "@/utils/text";
import { getDate } from "@/utils/time";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Analysis() {
  const router = useRouter();
  const [results, setResults] = useState<AnalysisResult[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("api/analysis");
        setResults(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);
  return (
    <main className="flex w-full h-screen overflow-auto flex-col">
      <header className="sticky top-0 flex items-center px-8 py-4 gap-6 border-b border-current/20 bg-white/50 dark:bg-zinc-700/70 backdrop-blur-sm dark:backdrop-blur-md z-10">
        <Link
          onClick={router.back}
          href={""}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-current/10"
        >
          <Icon name="arrow_back" />
        </Link>
        <h1 className="text-xl">Resultados de análisis realizados</h1>
      </header>
      <section className="flex flex-col gap-4 pt-8 px-8 pb-10">
        {!results.length ? (
          <div className="py-6 gap-2 flex flex-col items-center w-full">
            <Icon name="analytics" size={48} />
            <h1 className="text-lg text-current/80">
              No se encontraron resultados
            </h1>
          </div>
        ) : (
          results.map((item) => (
            <div
              className="bg-white dark:bg-zinc-800 border border-current/20 rounded-lg overflow-clip"
              key={item._id}
              onClick={() => router.push("/analysis/" + item._id)}
            >
              <div className="w-full flex items-center p-4 gap-4 cursor-pointer hover:bg-gray-300/20 dark:hover:bg-gray-700/20 transition-colors border-current/20">
                <div className="w-full">
                  <h2 className="text-lg">{getDate(item.createdAt)}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-current/60">
                      <Icon name="image" size={16} />
                      <span className="text-xs">
                        {item.total_images} imagen
                        {item.total_images != 1 ? "es" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-current/60">
                      <Icon name="pending" size={16} />
                      <span className="text-xs">
                        {item.total_rules} regla
                        {item.total_rules != 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs min-w-max px-2 py-1 rounded-md ${getAnalysisColor(
                    item.status
                  )}`}
                >
                  {toTitle(item.status)}
                </span>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
