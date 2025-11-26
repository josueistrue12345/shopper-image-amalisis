import { useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@/components/Icon";
import { Button } from "@/components/Button";
import Loader from "@/components/Loader";
import { MultiSelect } from "@/components/MultiSelect";
import {
  Checklist,
  Filtro,
  Form,
  Item,
  ItemSelection,
  Unit,
  UnitType,
} from "@/models/checklist";
import { countEvidences } from "@/utils/evidences";

interface BusquedaProps {
  onComplete: (selected: ItemSelection[]) => void;
}

export default function Busqueda({ onComplete }: BusquedaProps) {
  // Limite de rango de fechas
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const min = new Date();
  min.setMonth(min.getMonth() - 3);
  const minDate = min.toISOString().split("T")[0];

  // Filtros para buscar
  const [grupos, setGrupos] = useState<UnitType[]>([]);
  const [gruposVal, setGruposVal] = useState<UnitType[]>([]);
  const [unidades, setUnidades] = useState<Unit[]>([]);

  const [filters, setFilters] = useState<Filtro>({
    inicio: startDate,
    final: endDate,
    grupos: "",
    tiendas: "",
  });

  // Control de búsqueda
  const [alert, setAlert] = useState({
    loading: false,
    message: "",
    completed: false,
  });

  // Resultados y selección
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [selected, setSelected] = useState<ItemSelection[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get("api/units");
        setGrupos(response.data.types);
        setUnidades(response.data.units);
      } catch (error) {
        console.error("Error loading units:", error);
      }
    };
    load();
  }, []);

  // Consulta de formularios
  const search = async () => {
    setAlert({
      loading: true,
      completed: false,
      message: "",
    });
    try {
      const response1 = await axios.get("api/checklists", {
        params: filters,
      });
      const data = response1.data as Checklist[];
      setChecklists(data);

      const response2 = await axios.get("api/forms", {
        params: { ids: [...new Set(data.map((i) => i.checkApply))].join(",") },
      });

      setForms(response2.data);

      setAlert({
        loading: false,
        completed: true,
        message: "",
      });
    } catch (error) {
      console.error("Error loading checklists:", error);
      setAlert({
        loading: false,
        completed: false,
        message: (error as Error).message,
      });
    }
  };

  const isItemSelected = (item: Item, form: string) => {
    return selected.some((s) => s.id === item.id && s.checkApply === form);
  };

  const isFormSelected = (form: Form) => {
    const filtered = selected.filter((item) => item.checkApply === form._id);
    const countItems = form.areas.reduce((count, v) => {
      return count + (v?.items?.length || 0);
    }, 0);
    return filtered.length === countItems && filtered.length > 0;
  };

  const iconCheck = (form: Form) => {
    if (!form?._id) return "check_box_outline_blank";

    if (isFormSelected(form)) {
      return "check_box";
    }

    if (selected.some((item) => item.checkApply === form._id)) {
      return "indeterminate_check_box";
    }

    return "check_box_outline_blank";
  };

  const selectAll = (form: Form) => {
    if (isFormSelected(form)) {
      setSelected((prev) =>
        prev.filter((item) => item.checkApply !== form._id)
      );
      return;
    }

    const existingIds = new Set(
      selected
        .filter((item) => item.checkApply === form._id)
        .map((item) => item.id)
    );
    const newItems = form.areas.flatMap((area) =>
      area.items
        .filter((item) => !existingIds.has(item.id))
        .map((item) => ({
          ...item,
          checkApply: form._id,
          area: area.name,
        }))
    );

    setSelected((prev) => [...prev, ...newItems]);
  };

  const handleSelect = (select: ItemSelection) => {
    if (isItemSelected(select, select.checkApply)) {
      setSelected(
        selected.filter(
          (p) => !(p.id === select.id && p.checkApply === select.checkApply)
        )
      );
      return;
    }
    setSelected((p) => [...p, select]);
  };

  const restore = () => {
    setAlert({
      completed: false,
      loading: false,
      message: "",
    });
    setFilters({
      inicio: startDate,
      final: endDate,
      grupos: "",
      tiendas: "",
    });
    setGruposVal([]);
  };

  const countReplies = (item: Form) => {
    const replies = checklists.filter((c) => c.checkApply === item._id);
    return replies.length;
  };

  const toggleExpand = (item: Form) => {
    setForms((p) =>
      p.map((i) => (i._id === item._id ? { ...i, expanded: !i.expanded } : i))
    );
  };

  const countImages = (
    item: Item,
    checkApply: string,
    area: string
  ): number => {
    const lista = checklists.filter((c) => c.checkApply === checkApply);
    if (!lista.length) return 0;
    return lista.reduce((prev, current) => {
      const areaData = current.areas.find((a) => a.name === area);
      if (!areaData) return prev + 0;

      const itemData = areaData.items.find((i) => i.id === item.id);
      if (!itemData) return prev + 0;

      return prev + countEvidences(itemData);
    }, 0);
  };

  const handleComplete = () => {
    const itemReplies = selected.flatMap((select) =>
      checklists
        .filter((check) => check.checkApply === select.checkApply)
        .flatMap((r) =>
          r.areas
            .filter((a) => a.name === select.area)
            .flatMap((a) =>
              a.items
                .filter((item) => item.id === select.id)
                .map((item) => ({
                  ...item,
                  checkApply: select.checkApply,
                  area: select.area,
                  replie: r._id,
                }))
            )
        )
    );
    onComplete(itemReplies);
  };

  return (
    <div className="flex flex-col px-6 pb-10">
      <h2 className="text-2xl font-semibold mb-4">
        Busca y selecciona formularios
      </h2>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ${
          alert.completed || alert.loading ? "hidden" : ""
        }`}
      >
        <div>
          <label
            htmlFor="start-date"
            className="block mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Fecha inicio
          </label>
          <input
            type="date"
            id="start-date"
            value={filters.inicio}
            min={minDate}
            max={filters.final}
            onChange={(e) => setFilters({ ...filters, inicio: e.target.value })}
            className="w-full min-h-12 p-2 border border-current/20 rounded-md bg-white dark:bg-zinc-800"
          />
        </div>
        <div>
          <label
            htmlFor="end-date"
            className="block mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            Fecha final
          </label>
          <input
            type="date"
            id="end-date"
            value={filters.final}
            min={filters.inicio}
            max={endDate}
            onChange={(e) => setFilters({ ...filters, final: e.target.value })}
            className="w-full min-h-12 p-2 border border-current/20 rounded-md bg-white dark:bg-zinc-800"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Tipo de unidad
          </label>
          <MultiSelect
            options={grupos}
            onChange={(selected) => {
              const ids = selected.map((g) => g._id).join(",");
              setFilters({ ...filters, grupos: ids, tiendas: "" });
              setGruposVal(selected);
            }}
            renderOption={(grupo) => (
              <div className="text-sm py-1">{grupo.name}</div>
            )}
            renderSelection={(s) => (
              <span>{s.map((v) => v.name).join(", ")}</span>
            )}
            value={gruposVal}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Unidades
          </label>
          <MultiSelect
            options={unidades.filter((u) =>
              filters.grupos.includes(u.typeUnity)
            )}
            onChange={(selected) => {
              const ids = selected.map((u) => u._id).join(",");
              setFilters({ ...filters, tiendas: ids });
            }}
            renderOption={(unidad) => (
              <div>
                <div className="text-sm">{unidad.name}</div>
                <div className="text-sm text-gray-500">T{unidad.storeCode}</div>
              </div>
            )}
            renderSelection={(s) => (
              <span>{s.map((v) => v.name).join(", ")}</span>
            )}
            disabled={!filters.grupos.length}
          />
        </div>
      </div>

      {alert.loading && (
        <div className="flex w-full py-8 justify-center" role="status">
          <Loader size={10} />
        </div>
      )}

      {alert.message && (
        <div className="flex w-full py-8 gap-2" role="status">
          <Icon name="error" className="text-red-600" />
          <p>{alert.message}</p>
        </div>
      )}

      {alert.completed && (
        <div className="py-4 pl--1 flex items-center justify-between">
          <p>Formularios: {forms.length}</p>
          <p>Respuestas: {checklists.length}</p>
        </div>
      )}

      <div className={`space-y-3 ${alert.completed ? "" : "hidden"}`}>
        {forms?.map((item) => {
          return (
            <div
              key={item._id}
              className={`border border-current/20 bg-white dark:bg-zinc-800 overflow-hidden rounded-lg ${
                isFormSelected(item) ? "border-sky-500" : ""
              }`}
            >
              <div
                onClick={() => toggleExpand(item)}
                className={`p-4 cursor-pointer hover:bg-gray-300/20 dark:hover:bg-gray-700/20 transition-colors border-current/20 ${
                  item.expanded ? "border-b" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <Button
                    variant="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectAll(item);
                    }}
                  >
                    <Icon filled name={iconCheck(item)} />
                  </Button>
                  <div className="w-full">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-current/60">
                      {`${countReplies(item)} Respuesta${
                        countReplies(item) !== 1 ? "s" : ""
                      }`}
                    </p>
                  </div>
                  <Icon name={item.expanded ? "expand_less" : "expand_more"} />
                </div>
              </div>
              <div
                className={`transition-all duration-100 ease-in-out ${
                  item.expanded ? "opacity-100 h-full" : "opacity-0 h-0"
                }`}
              >
                {item.areas?.map((area) => {
                  return (
                    <div className="p-4 mb-1" key={area.name}>
                      <label className="text-sm text-current/60">
                        {area.name}
                      </label>
                      {area.items.map((q) => {
                        return (
                          <div
                            className="flex items-start gap-4 py-1"
                            key={q.id}
                          >
                            <Button
                              variant="icon"
                              onClick={() =>
                                handleSelect({
                                  ...q,
                                  checkApply: item._id,
                                  area: area.name,
                                })
                              }
                            >
                              <Icon
                                filled
                                name={
                                  isItemSelected(q, item._id)
                                    ? "check_box"
                                    : "check_box_outline_blank"
                                }
                              />
                            </Button>
                            <div className="w-full">
                              <p className="text-sm">{q.description}</p>
                              <div
                                className={`flex items-center gap-1 ${
                                  countImages(q, item._id, area.name) >= 1
                                    ? "text-green-600"
                                    : "text-current/50"
                                }`}
                              >
                                <span className="text-xs">
                                  {countImages(q, item._id, area.name)}
                                </span>
                                <Icon name="image" size={12} />
                              </div>
                            </div>
                            <span className="text-xs min-w-max px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">
                              {q.type || ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {alert.completed && !checklists?.length && (
          <p className="mt-8 text-gray-600">
            No se encontraron formularios con estos filtros
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-8 flex-wrap">
        {alert.completed ? (
          <>
            <Button
              variant="text"
              startIcon={<Icon name="filter_alt" />}
              onClick={restore}
            >
              Cambiar filtros
            </Button>
            <Button
              startIcon={<Icon name="check" />}
              onClick={handleComplete}
              disabled={!selected.length}
            >
              Seleccionar formularios
            </Button>
          </>
        ) : (
          <Button
            onClick={search}
            startIcon={<Icon name="search" />}
            disabled={alert.loading}
          >
            Buscar formularios
          </Button>
        )}
      </div>
    </div>
  );
}
