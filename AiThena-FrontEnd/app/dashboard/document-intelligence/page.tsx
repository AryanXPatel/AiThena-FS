"use client"

import { useRef } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { DocumentIntelligenceHub, type DocumentIntelligenceHubRef } from "@/components/tools/document-intelligence-hub"
import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DocumentIntelligencePage() {
  const documentHubRef = useRef<DocumentIntelligenceHubRef>(null)

  const handleUploadClick = () => {
    documentHubRef.current?.triggerUpload()
  }

  return (
    <DashboardLayout>
      <ToolLayout
        title="Document Intelligence Hub"
        description="AI-powered document analysis, summarization, and knowledge extraction"
        icon={FileText}
        badge="Smart Analysis"
        actions={
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleUploadClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        }
      >
        <DocumentIntelligenceHub ref={documentHubRef} />
      </ToolLayout>
    </DashboardLayout>
  )
}
