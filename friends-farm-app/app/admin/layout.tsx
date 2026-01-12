import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-full relative min-h-screen">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 md:start-0 z-50">
                <AdminSidebar />
            </div>
            <main className="md:ps-72 min-h-screen bg-gray-100/50">
                <AdminHeader />
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
