"use client"

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Trash } from "lucide-react"
import { products, categories } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    name: z.string().min(1),
    name_ar: z.string().min(1),
    description: z.string().optional().nullable(),
    description_ar: z.string().optional().nullable(),
    price: z.coerce.number().min(0.01),
    category_id: z.string().min(1),
    image_url: z.string().min(1).nullable(),
    is_featured: z.boolean().default(false),
    is_available: z.boolean().default(true),
    stock: z.coerce.number().min(0),
    unit: z.string().min(1),
    unit_ar: z.string().min(1),
})

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
    initialData: products | null
    categories: categories[]
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit Product" : "Create Product"
    const description = initialData ? "Edit a product" : "Add a new product"
    const toastMessage = initialData ? "Product updated." : "Product created."
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            name_ar: initialData.name_ar,
            description: initialData.description,
            description_ar: initialData.description_ar,
            price: parseFloat(String(initialData.price)),
            category_id: initialData.category_id || "",
            image_url: initialData.image_url,
            is_featured: initialData.is_featured,
            is_available: initialData.is_available,
            stock: initialData.stock,
            unit: initialData.unit,
            unit_ar: "كيلو", // Default value as it's not in schema yet
        } : {
            name: '',
            name_ar: '',
            description: '',
            description_ar: '',
            price: 0,
            category_id: '',
            image_url: '',
            is_featured: false,
            is_available: true,
            stock: 0,
            unit: 'kg',
            unit_ar: 'كيلو'
        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if (initialData) {
                await fetch(`/api/products/${params.productId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(data)
                })
            } else {
                await fetch(`/api/products`, {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
            }
            router.refresh()
            router.push(`/admin/products`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await fetch(`/api/products/${params.productId}`, {
                method: 'DELETE'
            })
            router.refresh()
            router.push(`/admin/products`)
            toast.success("Product deleted.")
        } catch (error) {
            toast.error("Something went wrong.")
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 w-full bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-green-900/5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Basic Info (EN) */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-[#1B5E20] uppercase tracking-tight">English Details</h3>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Product Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Product name" {...field} value={field.value || ""} className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Description</FormLabel>
                                        <FormControl>
                                            <Textarea disabled={loading} placeholder="Describe the product..." {...field} value={field.value || ""} className="rounded-2xl border-2 min-h-[120px] bg-gray-50/50 focus:bg-white transition-all font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Unit (e.g. kg, piece)</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="kg" {...field} value={field.value || ""} className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Basic Info (AR) */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black text-[#1B5E20] uppercase tracking-tight text-right">التفاصيل بالعربية</h3>
                            <FormField
                                control={form.control}
                                name="name_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest text-right block">اسم المنتج</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="اسم المنتج" {...field} value={field.value || ""} className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold text-right" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest text-right block">الوصف</FormLabel>
                                        <FormControl>
                                            <Textarea disabled={loading} placeholder="وصف المنتج..." {...field} value={field.value || ""} className="rounded-2xl border-2 min-h-[120px] bg-gray-50/50 focus:bg-white transition-all font-bold text-right" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit_ar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest text-right block">الوحدة (مثلاً: كيلو، حبة)</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="كيلو" {...field} value={field.value || ""} className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold text-right" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Shared Info */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-black text-[#1B5E20] uppercase tracking-tight">Price & Inventory</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Price (EGP)</FormLabel>
                                        <FormControl>
                                            <Input type="number" disabled={loading} placeholder="9.99" {...field} className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Stock Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" disabled={loading} placeholder="100" {...field} className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Category</FormLabel>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-2xl border-2 h-14 bg-gray-50/50 focus:bg-white transition-all font-bold">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id} className="font-bold py-3">
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Image URL</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value || ""}
                                                disabled={loading}
                                                onChange={(url) => field.onChange(url)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="is_featured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-[2rem] border p-6 bg-gray-50/30">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="w-5 h-5 accent-[#1B5E20] mt-1"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-black text-[#1B5E20] uppercase text-sm">Featured</FormLabel>
                                        <FormDescription className="text-[10px] font-bold text-gray-400">
                                            This product will appear on the home page.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_available"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-[2rem] border p-6 bg-gray-50/30">
                                    <FormControl>
                                        <input
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="w-5 h-5 accent-amber-500 mt-1"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-black text-amber-500 uppercase text-sm">Available</FormLabel>
                                        <FormDescription className="text-[10px] font-bold text-gray-400">
                                            This product will be visible in the store.
                                        </FormDescription>
                                    </div>
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
