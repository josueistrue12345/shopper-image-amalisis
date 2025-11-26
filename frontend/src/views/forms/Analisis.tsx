"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import { Complemento, Evidencia, ItemSelection } from "@/models/checklist";
import { extractEvidences, imageSrc } from "@/utils/evidences";
import { useRouter } from "next/navigation";
import { DataEvidencia, Prompt } from "@/models/analysis";
import { getDate } from "@/utils/time";

interface ItemsProps {
  items: ItemSelection[];
  restart?: () => void;
  close?: () => void;
}

export default function Items({ items, restart, close }: ItemsProps) {
  const router = useRouter();
  const [images, setImages] = useState<DataEvidencia[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [references, setReferences] = useState<Record<string, Evidencia[]>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const itemStr = useMemo(() => JSON.stringify(items), [items]);
  const [result, setResult] = useState({
    time: "",
    id: "",
  });

  const [rules, setRules] = useState<Prompt[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("api/prompts");
        setRules(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const extractEvidencesData = (
      item: ItemSelection,
      complements?: Complemento[]
    ) =>
      extractEvidences(complements).map((evidence) => ({
        ...evidence,
        itemId: item.id,
        replie: item.replie,
        checkApply: item.checkApply,
        area: item.area,
      }));

    const lista = items
      .flatMap((it) => [
        ...extractEvidencesData(it, it.complements),
        ...(it.response?.listSelected?.flatMap((r) =>
          extractEvidencesData(it, r.complements)
        ) || []),
        ...(it.response?.evaluativeOptions?.flatMap((r) =>
          extractEvidencesData(it, r.complements)
        ) || []),
      ])
      .filter((img) => img.type === 1);

    setImages(lista);
  }, [itemStr]);

  const processFiles = async (files: FileList): Promise<Evidencia[]> => {
    setIsUploading(true);
    const newImages: Evidencia[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post("api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        newImages.push({
          path: response.data.path,
          id: String(Date.now() + i),
          type: 1,
          name: file.name,
        });
      } catch (error) {
        newImages.push({
          path: URL.createObjectURL(file),
          id: String(Date.now() + i),
          type: 1,
          name: file.name,
        });
      }
    }
    setIsUploading(false);
    return newImages;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;
    const newImages = await processFiles(files);
    setImages([...images, ...newImages]);
  };

  const isSelected = (id: string) => {
    return selected.includes(id);
  };

  const handleSelect = (id: string) => {
    if (isSelected(id)) {
      setSelected(selected.filter((i) => i != id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleReferenceUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    ruleId: string
  ) => {
    const files = event.target.files;
    if (!files) return;
    const newImages = await processFiles(files);
    setReferences((prev) => ({
      ...prev,
      [ruleId]: [...(prev[ruleId] || []), ...newImages],
    }));
  };

  const removeReferenceImage = (ruleId: string, imageId: string) => {
    setReferences((prev) => ({
      ...prev,
      [ruleId]: prev[ruleId]?.filter((img) => img.id !== imageId) || [],
    }));
  };

  const handleStart = async () => {
    setIsAnalyzing(true);
    const payload = {
      images: images,
      rules: selected.map((ruleId) => ({
        id: ruleId,
        name: rules.find((r) => r._id === ruleId)?.title,
        references: references[ruleId]?.map((img) => img.path) || [],
      })),
    };

    try {
      const response = await axios.post("api/analysis", payload);
      setIsAnalyzing(false);
      setShowSuccess(true);
      setResult({
        id: response.data.id,
        time: getDate(new Date().toISOString()),
      });
    } catch (error: any) {
      setIsAnalyzing(false);
      setErrorMessage(
        error.response?.data?.message || "Error al iniciar análisis"
      );
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <div className="flex flex-col px-6">
      <h2 className="text-2xl font-semibold mb-4">
        Reglas de análisis para imágenes
      </h2>

      {images.length > 0 ? (
        <>
          <div className="flex gap-2 mt-6">
            <Icon name="check_circle" className="text-green-600" />
            {images.length > 1 ? (
              <p>Se encontraron {images.length} imágenes</p>
            ) : (
              <p>Se encontró 1 imagen</p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap mt-4">
            {images.slice(0, 4).map((img) => (
              <img
                key={img.id}
                alt={img.name}
                className="aspect-square h-18 object-cover rounded-md bg-current/10  border border-current/20"
                src={imageSrc(img.path)}
              />
            ))}
            {images.length > 4 && (
              <span className="text-md font-bold h-18 rounded-md border-current/10 px-2 flex items-center">
                +{images.length - 4}
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 mt-6">
          <p className="text-current/70 mb-4">
            No se encontraron imágenes. Puedes agregarlas directamente.
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            multiple
          />
          <label
            htmlFor="file-upload"
            className="bg-white dark:bg-zinc-800 border border-current/20 text-center rounded-lg overflow-hidden cursor-pointer transition-colors"
          >
            <div className="flex flex-col items-center gap-2 px-6 py-4 hover:bg-gray-300/20 dark:hover:bg-gray-700/20">
              <Icon name="image" />
              Subir imágenes
            </div>
          </label>
        </div>
      )}

      <div>
        <label className="block mb-1 mt-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {rules.length > 0
            ? "Selecciona las reglas para iniciar"
            : "No hay reglas de análisis"}
        </label>
        <div className="flex flex-col py-2 gap-2">
          {rules.map((r) => (
            <div
              className="bg-white dark:bg-zinc-800 border border-current/20 rounded-lg overflow-hidden"
              key={r._id}
            >
              <div
                onClick={() => handleSelect(r._id)}
                className="flex cursor-pointer"
              >
                <div
                  className={`w-full flex items-center p-4 gap-4 cursor-pointer hover:bg-gray-300/20 dark:hover:bg-gray-700/20 transition-colors border-current/20 ${
                    r.with_references ? "border-b" : ""
                  }`}
                >
                  <Button variant="icon">
                    <Icon
                      filled
                      name={
                        isSelected(r._id)
                          ? "check_box"
                          : "check_box_outline_blank"
                      }
                    />
                  </Button>
                  <div className="w-full">
                    <h3 className="font-medium">{r.title}</h3>
                    <p className="text-sm text-current/60">{r.description}</p>
                  </div>
                </div>
              </div>
              {r.with_references && (
                <div className="p-4 flex gap-2 flex-wrap mb-4">
                  {references[r._id]?.map((img) => (
                    <div key={img.id} className="relative">
                      <img
                        alt={img.name}
                        className="aspect-square border border-current/20 h-20 object-cover rounded-md"
                        src={imageSrc(img.path)}
                      />
                      <button
                        onClick={() => removeReferenceImage(r._id, img.id)}
                        className="absolute cursor-pointer -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  ))}
                  {(!references[r._id] || references[r._id].length < 3) && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={`reference-${r._id}`}
                        multiple
                        onChange={(e) => handleReferenceUpload(e, r._id)}
                      />
                      <label
                        htmlFor={`reference-${r._id}`}
                        className="aspect-square h-20 border border-current/20 text-center rounded-md overflow-hidden cursor-pointer transition-colors flex-shrink-0"
                      >
                        <div className="flex flex-col items-center justify-center h-full px-2 hover:bg-gray-300/20 dark:hover:bg-gray-700/20">
                          <Icon name="add" className="text-sm" />
                          <span className="text-xs">Agregar referencia</span>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-8 flex-wrap pb-6">
        <Button
          onClick={handleStart}
          startIcon={<Icon name="smart_toy" />}
          disabled={!images.length || !selected.length || isAnalyzing}
        >
          {isAnalyzing ? "Iniciando..." : "Iniciar análisis"}
        </Button>
        <Button onClick={restart} variant="text">
          Cambiar búsqueda
        </Button>
      </div>

      {/* Loading Toast */}
      {isUploading && (
        <div className="fixed bottom-4 right-8 bg-sky-600 text-white dark:bg-sky-200 dark:text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Icon name="upload" className="animate-pulse" />
          Subiendo imágenes...
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed bottom-4 right-8 bg-red-700 text-white dark:bg-red-300 dark:text-black px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
          <Icon name="error" />
          {errorMessage}
        </div>
      )}

      {/* Success Dialog */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 max-w-md mx-4">
            <div className="flex items-center gap-4 mb-4">
              <Icon
                name="check_circle"
                className="text-green-600"
                size={32}
                filled
              />
              <h3 className="text-lg font-semibold">Análisis iniciado</h3>
            </div>
            <p className="text-current/70 mb-2">
              El análisis se ha enviado correctamente. Consulta los resultados
              aquí.
            </p>
            {result.id && (
              <div
                className="bg-white dark:bg-zinc-800 border border-current/20 rounded-lg overflow-hidden"
                onClick={() => router.push("/analysis/" + result.id)}
              >
                <div className="w-full p-4 gap-4 cursor-pointer hover:bg-gray-300/20 dark:hover:bg-gray-700/20">
                  <h4 className="font-medium">{result.time}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1 text-current/60">
                      <Icon name="image" size={16} />
                      <span className="text-xs">
                        {images.length} imagen{images.length != 1 ? "es" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-current/60">
                      <Icon name="pending" size={16} />
                      <span className="text-xs">
                        {selected.length} regla{selected.length != 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end mt-6">
              {close && (
                <Button variant="text" onClick={close}>
                  Salir
                </Button>
              )}
              {restart && <Button onClick={restart}>Nuevo análisis</Button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
