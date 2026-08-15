import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

function SearchBar({
  onChange,
  placeholder = "Search",
  value = "",
  debounceMs = 350,
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onChange(internalValue);
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [internalValue, debounceMs, onChange]);

  return (
    <label className="relative block w-full max-w-sm">
      <span className="sr-only">{placeholder}</span>
      <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        onChange={(event) => setInternalValue(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={internalValue}
      />
    </label>
  );
}

export default SearchBar;
