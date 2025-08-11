import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { YouTubeExtractor } from "@/components/tools/youtube-extractor"
import { Video } from "lucide-react"

export default function YouTubeExtractorPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="YouTube Extractor"
        description="Extract transcripts and create study materials from educational videos"
        icon={Video}
        badge="Content Extraction"
      >
        <YouTubeExtractor />
      </ToolLayout>
    </DashboardLayout>
  )
}
