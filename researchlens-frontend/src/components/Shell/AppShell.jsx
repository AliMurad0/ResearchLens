import Sidebar from "./Sidebar";
import TabBar from "./TabBar";
import SearchTab from "../Search/SearchTab";
import PreviewPapersTab from "../Preview/PreviewPapersTab";
import InsightsTab from "../Insights/InsightsTab";
import { exportReportAsMarkdown, exportReportAsPDF } from "../../lib/exportReport";

export default function AppShell({
  activeTab,
  onChangeTab,
  result,
  onResult,
  highlightedPaperId,
  onCiteClick,
  history,
  projects,
  onNewSearch,
  onSelectHistory,
  onRemoveHistory,
  onCreateProject,
  onAssignToProject,
  onRemoveProject,
}) {
  return (
    <div className="flex min-h-screen bg-paper texture-grain">
      <Sidebar
        history={history}
        projects={projects}
        onNewSearch={onNewSearch}
        onSelectHistory={onSelectHistory}
        onRemoveHistory={onRemoveHistory}
        onCreateProject={onCreateProject}
        onAssignToProject={onAssignToProject}
        onRemoveProject={onRemoveProject}
      />

      <div className="flex-1 min-w-0">
        <TabBar
          active={activeTab}
          onChange={onChangeTab}
          disabled={!result}
          exportEnabled={!!result}
          onExportPDF={() => result && exportReportAsPDF(result)}
          onExportMarkdown={() => result && exportReportAsMarkdown(result)}
        />

        {activeTab === "search" && (
          <SearchTab
            result={result}
            onResult={onResult}
            onCiteClick={onCiteClick}
          />
        )}
        {activeTab === "preview" && (
          <PreviewPapersTab
            result={result}
            highlightedPaperId={highlightedPaperId}
          />
        )}
        {activeTab === "insights" && (
          <InsightsTab defaultTopic={result?.topic} />
        )}
      </div>
    </div>
  );
}
