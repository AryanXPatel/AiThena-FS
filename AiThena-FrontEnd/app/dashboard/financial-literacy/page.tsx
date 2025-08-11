import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolLayout } from "@/components/dashboard/tool-layout"
import { FinancialLiteracyHub } from "@/components/tools/financial-literacy-hub"

export default function FinancialLiteracyPage() {
  return (
    <DashboardLayout>
      <ToolLayout
        title="Financial Literacy Hub"
        description="Build financial knowledge with interactive tools and personalized guidance"
        icon="dollar-sign"
      >
        <FinancialLiteracyHub />
      </ToolLayout>
    </DashboardLayout>
  )
}
