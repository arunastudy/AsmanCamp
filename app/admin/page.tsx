import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const session = await getSession();

  if (!session.isAuthenticated || !session.user || session.user.role !== 'admin') {
    redirect('/auth/admin/login');
  }

  return <AdminDashboard user={session.user} />;
}
