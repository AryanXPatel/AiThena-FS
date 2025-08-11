import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { DocumentIntelligenceHub } from "@/components/tools/document-intelligence-hub"
import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DocumentIntelligencePage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Document Intelligence Hub"
        description="AI-powered document analysis, summarization, and knowledge extraction"
        icon={FileText}
        badge="Smart Analysis"
        actions={
          <Button className="bg-primary hover:bg-primary/90">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        }
      >
        <DocumentIntelligenceHub />
      </ToolLayout>
    </DashboardLayout>
  )
}
