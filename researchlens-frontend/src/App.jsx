import { useState } from "react";
import Landing from "./components/Landing/Landing";
import AppShell from "./components/Shell/AppShell";
import { useHistory } from "./hooks/useHistory";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [activeTab, setActiveTab] = useState("search");
  const [result, setResult] = useState(null);
  const [highlightedPaperId, setHighlightedPaperId] = useState(null);

  const {
    history,
    projects,
    recordSearch,
    removeSearch,
    addProject,
    assignToProject,
    removeProject,
  } = useHistory();

  function handleResult(topic, data) {
    setResult(data);
    setHighlightedPaperId(null);
    recordSearch(topic, data);
  }

  function handleSelectHistory(entry) {
    setResult(entry.result);
    setHighlightedPaperId(null);
    setActiveTab("search");
  }

  function handleNewSearch() {
    setResult(null);
    setHighlightedPaperId(null);
    setActiveTab("search");
  }

  function handleCiteClick(paperId) {
    setHighlightedPaperId(paperId);
    setActiveTab("preview");
  }

  if (!entered) {
    return <Landing onEnter={() => setEntered(true)} />;
  }

  return (
    <AppShell
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      result={result}
      onResult={handleResult}
      highlightedPaperId={highlightedPaperId}
      onCiteClick={handleCiteClick}
      history={history}
      projects={projects}
      onNewSearch={handleNewSearch}
      onSelectHistory={handleSelectHistory}
      onRemoveHistory={removeSearch}
      onCreateProject={addProject}
      onAssignToProject={assignToProject}
      onRemoveProject={removeProject}
    />
  );
}
