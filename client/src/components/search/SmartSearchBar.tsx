import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, Clock, Sparkles } from 'lucide-react';

type Props = {
  onSearch: (q: string) => void;
  initial?: string;
  // Optional: provide your AI suggestor (return plain strings)
  suggest?: (q: string) => Promise<string[]>;
};

const RECENTS_KEY = "beedab_recent_searches";
const MAX_RECENTS = 10;

function loadRecents(): string[] {
  try {
    const v = localStorage.getItem(RECENTS_KEY);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  const prev = loadRecents().filter((x) => x.toLowerCase() !== q.toLowerCase());
  const next = [q, ...prev].slice(0, MAX_RECENTS);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
}

export default function SmartSearchBar({ onSearch, initial = "", suggest }: Props) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [q, setQ] = useState(initial);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [ai, setAi] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>(loadRecents());
  const [highlight, setHighlight] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  // Positioning for portal
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = anchorRef.current;
      if (el) setRect(el.getBoundingClientRect());
    };
    update();
    const ro = new ResizeObserver(update);
    if (anchorRef.current) ro.observe(anchorRef.current);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  // Debounced AI suggestions
  useEffect(() => {
    if (!suggest) return;
    if (!open) return;
    const term = q.trim();
    if (!term) {
      setAi([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const response = await fetch(`/api/suggest?q=${encodeURIComponent(term)}`);
        const list = await response.json();
        setAi(Array.isArray(list) ? list : []);
        setHighlight(list.length ? 0 : -1);
      } catch (error) {
        console.warn('Suggestions failed:', error);
        setAi([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q, open, suggest]);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!anchorRef.current) return;
      if (!anchorRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const visibleList = useMemo(() => {
    const term = q.trim();
    return term ? ai : recents;
  }, [q, ai, recents]);

  function doSearch(term: string) {
    const value = term.trim();
    if (!value) return; // Ensure search term is not empty
    saveRecent(value);
    setRecents(loadRecents());
    onSearch(value);
    setOpen(false);
    setHighlight(-1);
    // Clear input focus after search
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const searchTerm = q.trim();
    if (searchTerm) {
      doSearch(searchTerm); // Pass trimmed q to doSearch
    }
  }

  function onPick(item: string) {
    setQ(item);
    doSearch(item);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!visibleList.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(i + 1, visibleList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (highlight >= 0) {
        e.preventDefault();
        onPick(visibleList[highlight]);
      } else {
        onSubmit(e);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const isShowingAI = q.trim() && ai.length > 0;
  const isShowingRecents = !q.trim() && recents.length > 0;

  return (
    <div ref={anchorRef} className="relative w-full">
      <div className="w-full">
        <div className="relative">
          <div className="flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search properties in Botswana…"
              className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-16 sm:pr-24 py-3 sm:py-4 text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:border-beedab-blue focus:outline-none focus:ring-1 focus:ring-beedab-blue"
            />
            <button
              type="submit"
              onClick={onSubmit}
              disabled={!q.trim()}
              className="absolute right-2 rounded-md bg-beedab-blue px-2 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-beedab-blue focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Search</span>
              <Search className="h-4 w-4 sm:hidden" />
            </button>
          </div>
        </div>
      </div>

      {/* Portal dropdown */}
      {open && rect && (isShowingAI || isShowingRecents || loading) && createPortal(
        <div
          style={{
            position: "fixed",
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: 2147483647,
          }}
          className="max-h-80 overflow-auto rounded-lg border border-gray-200 bg-white shadow-xl"
        >
          <div className="flex items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500 border-b border-gray-100">
            {q.trim() ? (
              <>
                <Sparkles className="h-3 w-3" />
                AI Suggestions
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" />
                Recent searches
              </>
            )}
            {loading && <div className="ml-auto animate-spin rounded-full h-3 w-3 border border-gray-300 border-t-beedab-blue" />}
          </div>

          {loading && !visibleList.length ? (
            <div className="px-4 py-3 text-sm text-gray-500">Loading suggestions...</div>
          ) : visibleList.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              {q.trim() ? "No suggestions found" : "No recent searches"}
            </div>
          ) : (
            visibleList.map((item, idx) => (
              <button
                key={`${item}-${idx}`}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors ${
                  idx === highlight ? "bg-blue-50 text-beedab-blue" : "text-gray-900"
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onPick(item)}
                onMouseEnter={() => setHighlight(idx)}
              >
                {q.trim() ? (
                  <Sparkles className="h-4 w-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
                <span className="truncate">{item}</span>
              </button>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
}