import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string })?.role !== 'admin') {
        redirect('/login');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl', background: '#f4f7fa' }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
}
