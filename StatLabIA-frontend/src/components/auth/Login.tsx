import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
    onNavigateToRegister: () => void;
}

export function Login({ onLogin, onNavigateToRegister }: LoginProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1000);
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@company.com"
                        required
                        className="w-full"
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-sm font-medium text-[color:var(--color-primary)] hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox id="remember" disabled={isLoading} />
                    <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Remember me
                    </Label>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-dark)]"
                    disabled={isLoading}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign in
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[color:var(--color-border)]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-[color:var(--color-text-tertiary)]">
                        Or
                    </span>
                </div>
            </div>

            <div className="text-center text-sm">
                <span className="text-[color:var(--color-text-secondary)]">
                    Don't have an account?{' '}
                </span>
                <button
                    onClick={onNavigateToRegister}
                    className="font-medium text-[color:var(--color-primary)] hover:underline"
                >
                    Sign up
                </button>
            </div>
        </AuthLayout>
    );
}
