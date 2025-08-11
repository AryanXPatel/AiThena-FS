import { Skeleton } from "@/components/ui/skeleton"

export function AuthSkeleton() {
  return (
    <div className="space-y-6">
      {/* Social Login Skeletons */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Separator */}
      <div className="relative">
        <Skeleton className="h-px w-full" />
        <div className="absolute inset-0 flex justify-center">
          <Skeleton className="h-4 w-32 bg-card" />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>

        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      {/* Footer Link */}
      <div className="text-center">
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  )
}
