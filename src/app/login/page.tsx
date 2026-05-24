import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/common/auth-context';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertCircle, LockKeyhole } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { login as loginApi } from '@/api/auth/api';

const loginSchema = z.object({
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginSchema = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const onSubmit = async (data: LoginSchema) => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const response = await loginApi(data);
            login(response.token, response.user);
            navigate('/dashboard');
        } catch (error: unknown) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan sistem, silakan coba lagi.';
            setSubmitError(errorMessage);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-slate-950 overflow-hidden font-sans p-4">
            {/* Background Glow Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-violet-600/10 blur-[110px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[420px] z-10 animate-in fade-in slide-in-from-bottom-6 duration-500">
                {/* Branding/Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3 border border-indigo-400/20">
                        <LockKeyhole className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold tracking-wider text-indigo-400 uppercase">Backoffice SPA</span>
                </div>

                <Card className="border-slate-800/80 bg-slate-900/50 backdrop-blur-xl text-slate-100 shadow-2xl p-6 gap-0">
                    <CardHeader className="space-y-1.5 text-center px-0 pt-0 pb-6 border-b border-slate-800/60">
                        <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                            Selamat Datang Kembali
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-sm">
                            Masukkan kredensial Anda untuk masuk ke sistem
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-6">
                        {submitError && (
                            <div className="flex items-start gap-2 p-3 text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 animate-in fade-in duration-200">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        {/* Field Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="email">
                                Email Address
                            </label>
                            <Input
                                id="email"
                                placeholder="nama@perusahaan.com"
                                type="email"
                                className="h-10 bg-slate-950/40 border-slate-800/80 text-slate-100 placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-400 font-medium animate-in fade-in duration-100 mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Field Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="password">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="h-10 bg-slate-950/40 border-slate-800/80 text-slate-100 placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-all"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-400 font-medium animate-in fade-in duration-100 mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Spinner className="text-white h-4 w-4" />
                                        Memvalidasi...
                                    </span>
                                ) : (
                                    'Masuk Ke Dashboard'
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
