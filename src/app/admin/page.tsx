'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';
import { 
  FileText, 
  Mail, 
  Users, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingInvoices: 0,
    totalRevenue: 0,
    recentQuotes: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      router.push('/admin/login');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch invoices stats
      const invoicesRes = await fetch('/api/invoices');
      const invoicesData = await invoicesRes.json();
      
      const totalInvoices = invoicesData.total || 0;
      const pendingInvoices = invoicesData.invoices?.filter(
        (inv: any) => inv.paymentStatus === 'unpaid' || inv.paymentStatus === 'partial'
      ).length || 0;
      
      const totalRevenue = invoicesData.invoices?.reduce(
        (sum: number, inv: any) => sum + (inv.paidAmount || 0), 0
      ) || 0;

      setStats({
        totalInvoices,
        pendingInvoices,
        totalRevenue,
        recentQuotes: 0 // Will be implemented when quotes API is ready
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('ZAR', 'R');
  };

  const quickLinks = [
    {
      title: 'Invoices',
      description: 'Manage invoices, track payments, and send to customers',
      icon: FileText,
      href: '/admin/invoices',
      color: 'from-blue-500 to-blue-600',
      stats: `${stats.totalInvoices} total`
    },
    {
      title: 'Quotes',
      description: 'View and manage customer quotes',
      icon: DollarSign,
      href: '/admin/quotes',
      color: 'from-green-500 to-green-600',
      stats: `${stats.recentQuotes} recent`
    },
    {
      title: 'Contacts',
      description: 'Manage customer contacts and leads',
      icon: Users,
      href: '/admin/contacts',
      color: 'from-purple-500 to-purple-600',
      stats: 'View all'
    },
    {
      title: 'Messages',
      description: 'View contact form submissions',
      icon: Mail,
      href: '/admin/messages',
      color: 'from-orange-500 to-orange-600',
      stats: 'Check inbox'
    }
  ];

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices.toString(),
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Pending Payments',
      value: stats.pendingInvoices.toString(),
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Recent Quotes',
      value: stats.recentQuotes.toString(),
      icon: CheckCircle,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <>
      <Header />
      
      <PageHero
        title="Admin Dashboard"
        subtitle="Breed Industries"
        description="Manage your business operations, invoices, quotes, and customer relationships."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' }
        ]}
        size="default"
        align="left"
      >
        <button
          onClick={handleLogout}
          className="btn btn-outline flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </PageHero>

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`${stat.color}`} size={24} />
                  </div>
                </div>
                <h3 className="text-white/70 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-heading font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-white mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => (
                <div
                  key={index}
                  onClick={() => router.push(link.href)}
                  className="glass-card p-6 hover:border-accent/50 transition-all duration-300 group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push(link.href);
                    }
                  }}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <link.icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-3">{link.description}</p>
                  <p className="text-accent text-sm font-medium">{link.stats}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-white">Recent Activity</h2>
              <button className="text-accent hover:text-accent/80 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {stats.totalInvoices === 0 ? (
                <div className="text-center py-12 text-white/60">
                  <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No recent activity. Start by creating an invoice or quote.</p>
                </div>
              ) : (
                <div className="text-white/70">
                  <p className="text-sm">Recent activity will appear here as you use the system.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
