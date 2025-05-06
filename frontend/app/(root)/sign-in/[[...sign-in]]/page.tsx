import React from 'react'
import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Sign In Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </div>
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none",
                                headerTitle: "hidden",
                                headerSubtitle: "hidden",
                                socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
                                formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
                                footerActionLink: "text-blue-600 hover:text-blue-700",
                            }
                        }}
                    />
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
                    <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="relative h-full flex items-center justify-center p-12">
                    <div className="text-white text-center">
                        <h2 className="text-4xl font-bold mb-4">Find Your Perfect Roommate</h2>
                        <p className="text-xl opacity-90">
                            Join thousands of students and young professionals in finding their ideal living situation
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignInPage 