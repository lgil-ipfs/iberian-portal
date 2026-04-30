import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF8F4]">
      <SignUp />
    </main>
  )
}
