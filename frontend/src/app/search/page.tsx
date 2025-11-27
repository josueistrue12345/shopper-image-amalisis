"use client";

import { Icon } from "@/components/Icon";
import Busqueda from "@/views/forms/Busqueda";
import Analisis from "@/views/forms/Analisis";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ItemSelection } from "@/models/checklist";

export default function Search() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [items, setItems] = useState<ItemSelection[]>([]);
  const steps = [
    {
      title: "Búsqueda",
      description: "Selecciona formularios",
    },
    {
      title: "Análisis",
      description: "Selecciona reglas",
    },
  ];

  return (
    <main className="flex w-full h-screen overflow-auto flex-col">
      <header className="flex items-center px-8 py-4 gap-6 border-b border-current/20 bg-white dark:bg-zinc-600/50">
        <Link
          onClick={router.back}
          href={""}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-current/10"
        >
          <Icon name="arrow_back" />
        </Link>
        <h1 className="text-xl">Busca formularios para análisis</h1>
      </header>
      <section className="flex h-full gap-4 pt-8 px-8 pb-10 ">
        <aside className="flex-col w-60 gap-6 hidden sm:flex">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 relative">
              {i < steps.length - 1 && (
                <span className="bg-gray-300 dark:bg-gray-700 w-2 h-20 absolute left-2 top-4 -z-1"></span>
              )}
              <span
                className={`outline-2 w-6 h-6 mt-1 rounded-full flex items-center justify-center text-sm font-medium ${
                  current >= i
                    ? "bg-sky-700 text-white"
                    : "bg-gray-200 text-black dark:text-white dark:bg-zinc-700"
                } ${
                  current === i
                    ? "outline-gray-900 dark:outline-white"
                    : "outline-background"
                }`}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm">{step.title}</p>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </span>
              </div>
            </div>
          ))}
        </aside>
        <div className="grow-1 w-full h-full rounded-xl">
          {current == 0 && (
            <Busqueda
              onComplete={(s) => {
                setItems(s);
                setCurrent(1);
              }}
            />
          )}
          {current == 1 && (
            <Analisis
              items={items}
              close={() => router.back()}
              restart={() => setCurrent(0)}
            />
          )}
        </div>
      </section>
    </main>
  );
}
