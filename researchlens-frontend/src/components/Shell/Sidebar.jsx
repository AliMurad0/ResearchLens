import { useState } from "react";
import {
  IconPlus,
  IconClock,
  IconFolder,
  IconStack,
  IconClose,
  IconChevronDown,
} from "../icons/icons";
import ThemeToggle from "./ThemeToggle";

function timeAgo(ts) {
  const diffMin = Math.round((Date.now() - ts) / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.round(diffHr / 24)}d ago`;
}

function AddToProjectPopover({ projects, onPick, onCreate, onClose }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="absolute right-0 top-6 z-20 w-48 rounded-lg border border-paper-line bg-surface shadow-float p-1.5">
      {projects.length > 0 && (
        <div className="max-h-32 overflow-y-auto scrollbar-thin">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onPick(p.id);
                onClose();
              }}
              className="w-full text-left px-2.5 py-1.5 rounded-md text-sm text-ink-soft hover:bg-paper-dim transition-colors"
            >
              {p.name}
            </button>
          ))}
          <div className="my-1 h-px bg-paper-line" />
        </div>
      )}
      {creating ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              onCreate(name.trim());
              onClose();
            }
          }}
          className="p-1"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="w-full text-sm px-2 py-1.5 rounded-md border border-paper-line focus:border-lamp outline-none"
          />
        </form>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="w-full text-left px-2.5 py-1.5 rounded-md text-sm text-lamp hover:bg-lamp-tint transition-colors"
        >
          + New project
        </button>
      )}
    </div>
  );
}

export default function Sidebar({
  history,
  projects,
  onNewSearch,
  onSelectHistory,
  onRemoveHistory,
  onCreateProject,
  onAssignToProject,
  onRemoveProject,
}) {
  const [openPopoverId, setOpenPopoverId] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);

  const historyById = (id) => history.find((h) => h.id === id);

  return (
    <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 flex-col border-r border-paper-line bg-paper-dim/40">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <span className="font-serif text-lg text-ink">ResearchLens</span>
        <ThemeToggle />
      </div>

      <div className="px-3.5">
        <button
          onClick={onNewSearch}
          className="w-full flex items-center gap-2 rounded-lg border border-paper-line bg-surface px-3 py-2.5 text-sm text-ink hover:border-lamp/40 hover:shadow-card transition-all"
        >
          <IconPlus size={15} />
          New search
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-3.5 mt-6 space-y-6">
        <div>
          <div className="flex items-center gap-1.5 px-1.5 mb-2 text-ink-faint">
            <IconClock size={13} />
            <span className="text-[11px] font-medium">History</span>
          </div>
          {history.length === 0 ? (
            <p className="px-1.5 text-xs text-ink-faint">
              Your past searches will appear here.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {history.map((h) => (
                <li key={h.id} className="group relative">
                  <button
                    onClick={() => onSelectHistory(h)}
                    className="w-full text-left px-2.5 py-2 rounded-md text-sm text-ink-soft hover:bg-surface hover:shadow-card transition-all truncate pr-12"
                    title={h.topic}
                  >
                    <span className="block truncate">{h.topic}</span>
                    <span className="block text-[11px] text-ink-faint mt-0.5">
                      {timeAgo(h.createdAt)}
                    </span>
                  </button>
                  <div className="absolute right-1 top-1.5 flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        setOpenPopoverId(openPopoverId === h.id ? null : h.id)
                      }
                      className="p-1 rounded text-ink-faint hover:text-lamp"
                      aria-label="Add to project"
                    >
                      <IconFolder size={13} />
                    </button>
                    <button
                      onClick={() => onRemoveHistory(h.id)}
                      className="p-1 rounded text-ink-faint hover:text-stamp"
                      aria-label="Remove"
                    >
                      <IconClose size={13} />
                    </button>
                  </div>
                  {openPopoverId === h.id && (
                    <AddToProjectPopover
                      projects={projects}
                      onPick={(projectId) => onAssignToProject(projectId, h.id)}
                      onCreate={(name) => {
                        const newId = onCreateProject(name);
                        onAssignToProject(newId, h.id);
                      }}
                      onClose={() => setOpenPopoverId(null)}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5 px-1.5 mb-2 text-ink-faint">
            <IconStack size={13} />
            <span className="text-[11px] font-medium">Projects</span>
          </div>
          {projects.length === 0 ? (
            <p className="px-1.5 text-xs text-ink-faint">
              Group related searches into a project from the history list.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {projects.map((p) => {
                const isOpen = expandedProject === p.id;
                return (
                  <li key={p.id}>
                    <div className="group flex items-center">
                      <button
                        onClick={() => setExpandedProject(isOpen ? null : p.id)}
                        className="flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-md text-sm text-ink-soft hover:bg-surface hover:shadow-card transition-all truncate"
                      >
                        <IconChevronDown
                          size={12}
                          className={`transition-transform shrink-0 ${
                            isOpen ? "" : "-rotate-90"
                          }`}
                        />
                        <span className="truncate">{p.name}</span>
                      </button>
                      <button
                        onClick={() => onRemoveProject(p.id)}
                        className="p-1 mr-1 rounded text-ink-faint hover:text-stamp opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete project"
                      >
                        <IconClose size={12} />
                      </button>
                    </div>
                    {isOpen && (
                      <ul className="ml-6 border-l border-paper-line pl-2 space-y-0.5 py-1">
                        {p.historyIds.length === 0 && (
                          <li className="text-xs text-ink-faint px-1.5 py-1">
                            No searches yet
                          </li>
                        )}
                        {p.historyIds.map((hid) => {
                          const h = historyById(hid);
                          if (!h) return null;
                          return (
                            <li key={hid}>
                              <button
                                onClick={() => onSelectHistory(h)}
                                className="w-full text-left px-1.5 py-1 rounded text-xs text-ink-soft hover:text-lamp truncate"
                              >
                                {h.topic}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="px-5 py-4 border-t border-paper-line">
        <p className="text-[11px] text-ink-faint leading-relaxed">
          Frontend running on mock data. See README to connect your backend.
        </p>
      </div>
    </aside>
  );
}
