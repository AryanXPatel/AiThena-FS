import { SignupForm } from "@/components/auth/signup-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Start your AI-powered learning journey" showBackToHome={true}>
      <SignupForm />
    </AuthLayout>
  )
}
