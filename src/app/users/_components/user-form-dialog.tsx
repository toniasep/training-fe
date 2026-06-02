import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useCreateUserMutation } from '../_hooks/use-create-user-mutation';
import { useUpdateUserMutation } from '../_hooks/use-update-user-mutation';
import { useToast } from '@/app/_components/toast-context';
import type { TUser } from '@/api/users/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/app/_components/ui/dialog';
import { Input } from '@/app/_components/ui/input';
import { Button } from '@/app/_components/ui/button';
import { Spinner } from '@/app/_components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/app/_components/ui/select';
import { AlertCircle } from 'lucide-react';

const userSchema = z.object({
    name: z.string().min(2, 'Nama minimal terdiri dari 2 karakter'),
    email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
    role: z.enum(['admin', 'operator', 'viewer'] as const, {
        message: 'Role wajib dipilih',
    }),
    status: z.enum(['active', 'invited', 'suspended'] as const, {
        message: 'Status wajib dipilih',
    }),
    password: z.string().min(1, 'Password wajib diisi'),
});

type UserFormSchema = z.infer<typeof userSchema>;

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: TUser;
    onSuccess: () => void;
}

export const UserFormDialog = ({ open, onOpenChange, user, onSuccess }: UserFormDialogProps) => {
    const isEdit = !!user;
    const { toast } = useToast();

    const createUserMutation = useCreateUserMutation();
    const updateUserMutation = useUpdateUserMutation();

    const isSubmitting = createUserMutation.isPending || updateUserMutation.isPending;
    const submitError = createUserMutation.error?.message || updateUserMutation.error?.message || null;

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<UserFormSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            role: undefined,
            status: undefined,
            password: '',
        },
    });

    const { reset: resetCreate } = createUserMutation;
    const { reset: resetUpdate } = updateUserMutation;

    useEffect(() => {
        if (open) {
            resetCreate();
            resetUpdate();
            if (user) {
                reset({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    password: user.password,
                });
            } else {
                reset({
                    name: '',
                    email: '',
                    role: undefined,
                    status: undefined,
                    password: '',
                });
            }
        }
    }, [open, user, reset, resetCreate, resetUpdate]);

    const onSubmit = (data: UserFormSchema) => {
        if (isEdit && user) {
            updateUserMutation.mutate(
                { id: user.id, data },
                {
                    onSuccess: () => {
                        toast(`User ${data.name} berhasil diperbarui.`, 'success');
                        onSuccess();
                        onOpenChange(false);
                    },
                }
            );
        } else {
            createUserMutation.mutate(data, {
                onSuccess: () => {
                    toast(`User ${data.name} berhasil ditambahkan.`, 'success');
                    onSuccess();
                    onOpenChange(false);
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    {/* API-level Submit Error */}
                    {submitError && (
                        <div className="flex items-start gap-2 p-3 text-sm rounded-lg bg-destructive/15 border border-destructive/20 text-destructive animate-in fade-in duration-200">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <span>{submitError}</span>
                        </div>
                    )}

                    {/* Field Nama */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground" htmlFor="name">
                            Nama Lengkap
                        </label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            className={errors.name ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive font-medium animate-in fade-in duration-200">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Field Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground" htmlFor="email">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            className={errors.email ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive font-medium animate-in fade-in duration-200">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Field Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Role</label>
                        <Controller
                            control={control}
                            name="role"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={`w-full ${errors.role ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}>
                                        <SelectValue placeholder="Pilih Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="operator">Operator</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.role && (
                            <p className="text-xs text-destructive font-medium animate-in fade-in duration-200">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    {/* Field Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Status</label>
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={`w-full ${errors.status ? 'border-destructive focus-visible:ring-destructive/20' : ''}`}>
                                        <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="invited">Invited</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.status && (
                            <p className="text-xs text-destructive font-medium animate-in fade-in duration-200">
                                {errors.status.message}
                            </p>
                        )}
                    </div>

                    {/* Field Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground" htmlFor="password">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className={errors.password ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                            {...register('password')}
                        />
                        {errors.password && (
                            <p className="text-xs text-destructive font-medium animate-in fade-in duration-200">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Spinner className="text-white" />
                                    Menyimpan...
                                </span>
                            ) : (
                                'Simpan'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
