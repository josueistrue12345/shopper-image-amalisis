import { useState, useRef, useEffect, useMemo } from "react";
import { Icon } from "./Icon";

interface MultiSelectProps<T> {
  options: T[];
  value?: T[];
  onChange?: (selected: T[]) => void;
  renderOption: (option: T, isSelected: boolean) => React.ReactNode;
  renderSelection?: (selection: T[]) => React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect<T>({
  options,
  value = [],
  onChange = () => {},
  renderOption,
  placeholder = "Seleccionar",
  disabled = false,
  className = "",
  renderSelection,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  const valueStr = useMemo(() => JSON.stringify(value), [value]);
  const optionsStr = useMemo(() => JSON.stringify(options), [options]);

  useEffect(() => {
    setSelected(value);
  }, [valueStr]);

  useEffect(() => {
    const validSelected = selected.filter((item) =>
      options.some((option) => JSON.stringify(option) === JSON.stringify(item))
    );

    if (validSelected.length !== selected.length) {
      setSelected(validSelected);
      onChange(validSelected);
    }
  }, [optionsStr]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (option: T) => {
    const strSelection = selected.map((item) => JSON.stringify(item));
    const strOption = JSON.stringify(option);

    return strSelection.includes(strOption);
  };

  const toggleOption = (option: T) => {
    const newValue = isSelected(option)
      ? selected.filter(
          (item) => JSON.stringify(item) !== JSON.stringify(option)
        )
      : [...selected, option];
    onChange(newValue);
    setSelected(newValue);
  };

  const selectedCount = selected.length;
  const displayText = `${selectedCount} seleccionado${
    selectedCount > 1 ? "s" : ""
  }`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          overflow-ellipsis w-full min-h-12 px-3 py-2 text-left border border-current/20 rounded-md 
          bg-white dark:bg-zinc-800 flex items-center justify-between
          ${
            disabled
              ? "opacity-50 cursor-default"
              : "cursor-pointer hover:border-current/30"
          }
          ${isOpen ? "border-black ring-1 ring-black dark:ring-white" : ""}
        `}
      >
        {selectedCount == 0 && (
          <span className="text-gray-500 truncate">{placeholder}</span>
        )}
        {!!renderSelection ? (
          <div className="truncate">{renderSelection(selected)}</div>
        ) : (
          <span className="truncate">{displayText}</span>
        )}
        <Icon
          name={isOpen ? "expand_less" : "expand_more"}
          className="text-gray-400"
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-3 py-3 text-gray-500 text-sm">
              No hay opciones disponibles
            </div>
          ) : (
            options.map((option, i) => {
              const checked = isSelected(option);

              return (
                <div
                  key={i}
                  onClick={() => toggleOption(option)}
                  className={`
                    px-3 py-2 cursor-pointer flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-zinc-700
                    ${checked ? "bg-sky-50 dark:bg-sky-500/10" : ""}
                  `}
                >
                  <Icon
                    name={checked ? "check_box" : "check_box_outline_blank"}
                    className={checked ? "text-sky-700 dark:text-sky-300" : "text-gray-400"}
                    filled={checked}
                  />
                  <div className="flex-1">{renderOption(option, checked)}</div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
