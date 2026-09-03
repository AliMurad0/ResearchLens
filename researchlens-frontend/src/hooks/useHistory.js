import { useState, useCallback } from "react";
import * as storage from "../lib/storage";

export function useHistory() {
  const [history, setHistory] = useState(() => storage.getHistory());
  const [projects, setProjects] = useState(() => storage.getProjects());

  const recordSearch = useCallback((topic, resultSnapshot) => {
    const next = storage.addToHistory({ topic, result: resultSnapshot });
    setHistory(next);
  }, []);

  const removeSearch = useCallback((id) => {
    setHistory(storage.removeFromHistory(id));
  }, []);

  const addProject = useCallback((name) => {
    const next = storage.createProject(name);
    setProjects(next);
    return next[next.length - 1].id;
  }, []);

  const assignToProject = useCallback((projectId, historyId) => {
    setProjects(storage.addHistoryToProject(projectId, historyId));
  }, []);

  const removeProject = useCallback((projectId) => {
    setProjects(storage.deleteProject(projectId));
  }, []);

  return {
    history,
    projects,
    recordSearch,
    removeSearch,
    addProject,
    assignToProject,
    removeProject,
  };
}
