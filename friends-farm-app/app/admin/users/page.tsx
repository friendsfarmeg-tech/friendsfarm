"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { DataTable } from "@/components/ui/data-table"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { columns, UserColumn } from "./columns"
import { useLanguage } from "@/components/language-provider"
import { Loader2 } from "lucide-react"

const UsersPage = () => {
    const { t } = useLanguage()
    const [users, setUsers] = useState<UserColumn[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // We need an API route for users
                const response = await fetch('/api/admin/users')
                const data = await response.json()

                const formatted: UserColumn[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    email: item.email,
                    role: item.is_admin ? "ADMIN" : "USER",
                    createdAt: item.created_at ? format(new Date(item.created_at), "MMMM do, yyyy") : "N/A",
                }))

                setUsers(formatted)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return (
        <div className="flex-col animate-in fade-in duration-700">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`${t("Users")} (${users.length})`}
                        description={t("Manage Users")}
                    />
                </div>
                <Separator className="bg-green-100" />
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] p-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                        </div>
                    ) : (
                        <DataTable searchKey="email" columns={columns} data={users} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default UsersPage
