import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { forwardRef, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const CommandEmpty = forwardRef(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);
  if (!render) return null;
  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});
CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = React.forwardRef(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      inputProps,
      commandProps,
    },
    ref
  ) => {
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const mouseOn = React.useRef(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    
    // Internal state for options and selection
    const [selected, setSelected] = React.useState(value || []);
    const [options, setOptions] = React.useState(
      transToGroupOption(arrayOptions || defaultOptions, groupBy)
    );

    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    // Sync with external value prop
    useEffect(() => {
      setSelected(value || []);
    }, [value]);

    // Sync with external options (e.g., when API returns contacts)
    useEffect(() => {
      const targetOptions = arrayOptions || defaultOptions;
      if (onSearch || !targetOptions) return;
      setOptions(transToGroupOption(targetOptions, groupBy));
    }, [defaultOptions, arrayOptions, groupBy, onSearch]);

    const handleUnselect = React.useCallback(
      (option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected]
    );

    const selectables = React.useMemo(
      () => removePickedOption(options, selected),
      [options, selected]
    );

    return (
      <Command
        {...commandProps}
        // CRITICAL FIX: reset internal filter state when inputValue changes
        onKeyDown={(e) => {
          if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
            handleUnselect(selected[selected.length - 1]);
          }
        }}
        className={cn("h-auto overflow-visible bg-transparent", commandProps?.className)}
        shouldFilter={!onSearch}
      >
        <div
          className={cn(
            "min-h-12 max-h-32 text-white overflow-y-auto custom-scrollbar rounded-md border border-slate-800 bg-[#292b36] text-sm focus-within:ring-1 focus-within:ring-blue-500/50 transition-all",
            { "px-3 py-2": selected.length !== 0 },
            className
          )}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex flex-wrap gap-2">
            {selected.map((option) => (
              <Badge
                key={option.value}
                className={cn("bg-purple-600 hover:bg-purple-700 text-white border-none px-2 py-1 flex items-center gap-1", badgeClassName)}
              >
                {option.label}
                {!disabled && (
                  <button
                    type="button"
                    className="ml-1 rounded-full outline-none hover:bg-black/20"
                    onClick={(e) => { e.stopPropagation(); handleUnselect(option); }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            <CommandPrimitive.Input
              {...inputProps}
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => !mouseOn.current && setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder={hidePlaceholderWhenSelected && selected.length !== 0 ? "" : placeholder}
              className={cn("flex-1 bg-transparent outline-none placeholder:text-slate-600 min-w-30", { "px-3 py-2": selected.length === 0 }, inputProps?.className)}
            />
          </div>
        </div>

        <div className="relative">
          {open && (
            <CommandList
              className="absolute top-2 z-50 w-full rounded-md border border-slate-800 bg-[#1f202a] text-white shadow-xl outline-none max-h-62.5 overflow-y-auto"
              onMouseLeave={() => (mouseOn.current = false)}
              onMouseEnter={() => (mouseOn.current = true)}
            >
              <CommandEmpty>{emptyIndicator || "No results found."}</CommandEmpty>
              {Object.entries(selectables).map(([key, dropdowns]) => (
                <CommandGroup key={key} heading={key} className="p-1">
                  {dropdowns.map((option) => (
                    <CommandItem
                      key={option.value}
                      // Use label for search but value for selection
                      value={option.label} 
                      onSelect={() => {
                        if (selected.length >= maxSelected) return;
                        setInputValue(""); // Clear search
                        const newOptions = [...selected, option];
                        setSelected(newOptions);
                        onChange?.(newOptions);
                      }}
                      className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-purple-600 aria-selected:bg-purple-600 transition-colors"
                    >
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          )}
        </div>
      </Command>
    );
  }
);
MultipleSelector.displayName = "MultipleSelector";

export default MultipleSelector;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

function transToGroupOption(options, groupBy) {
  if (!options?.length) return {};
  if (!groupBy) return { "": options };
  const groupOption = {};
  options.forEach((option) => {
    const key = option[groupBy] || "";
    if (!groupOption[key]) groupOption[key] = [];
    groupOption[key].push(option);
  });
  return groupOption;
}

function removePickedOption(groupOption, picked) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption));
  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter((val) => !picked.find((p) => p.value === val.value));
  }
  return cloneOption;
}