"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Trash } from "lucide-react"
import { categories } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { useLanguage } from "@/components/language-provider"

const formSchema = z.object({
    name: z.string().min(1),
    name_ar: z.string().min(1),
    image_url: z.string().min(1),
    discount_percentage: z.number().min(0).max(100).optional(),
    is_offer_active: z.boolean().default(false).optional(),
})

type CategoryFormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    initialData: categories | null
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData
}) => {
    const params = useParams()
    const router = useRouter()
    const { t } = useLanguage()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? t("Update") : t("Create")
    const description = initialData ? t("Edit a category") : t("Add a new category")
    const toastMessage = initialData ? t("Category updated.") : t("Category created.")
    const action = initialData ? t("Save Changes") : t("Create")

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            image_url: initialData.image_url || '',
            discount_percentage: initialData.discount_percentage || 0,
            is_offer_active: initialData.is_offer_active || false,
        } : {
            name: '',
            name_ar: '',
            image_url: '',
            discount_percentage: 0,
            is_offer_active: false,
        }
    })

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await fetch(`/api/categories/${params.categoryId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(data)
                })
            } else {
                await fetch(`/api/categories`, {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
            }
            router.refresh()
            router.push(`/admin/categories`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error(t("Something went wrong"))
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await fetch(`/api/categories/${params.categoryId}`, {
                method: 'DELETE'
            })
            router.refresh()
            router.push(`/admin/categories`)
            toast.success(t("Successfully deleted"))
        } catch (error) {
            toast.error(t("Something went wrong"))
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="icon"
                        onClick={() => setOpen(true)}
                        className="rounded-2xl h-12 w-12"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>
            <Separator className="my-8 h-px bg-green-100/50" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-900/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">{t("Name (EN)")}</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder={t("Category Name")} {...field} className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name_ar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">{t("Name (AR)")}</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder={t("Category Name (Arabic)")} {...field} className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="discount_percentage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">{t("Discount (%)")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={loading}
                                            placeholder="0"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value))}
                                            className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_offer_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-2xl border-2 border-green-100 p-4 shadow-sm">
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={field.value}
                                                onChange={field.onChange}
                                                className="w-5 h-5 rounded-md border-gray-300 text-[#1B5E20] focus:ring-[#1B5E20]"
                                            />
                                            <FormLabel className="text-gray-600 font-bold cursor-pointer m-0">
                                                {t("Active Offer")}
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">{t("Category Image")}</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            value={field.value}
                                            disabled={loading}
                                            onChange={(url) => field.onChange(url)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white font-black uppercase tracking-widest rounded-2xl h-16 px-12 shadow-xl shadow-green-900/20 text-lg" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}
