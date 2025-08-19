import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <SignUp 
        afterSignUpUrl="/" // Redirect to home after successful complete sign-up
        afterSignInUrl="/" // Redirect to home after successful sign-in
      />
    </div>
  ) 
}