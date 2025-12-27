'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
    const router = useRouter();
    const [mahasiswa, setMahasiswa] = useState([]);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    // --- 1. Fetch Data ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const name = localStorage.getItem('user_name');

        if (!token) {
            router.push('/login');
            return;
        }

        setUserName(name);

        fetch('https://hafid.copium.id/api/mahasiswa', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            if (res.status === 401) throw new Error('Sesi habis');
            return res.json();
        })
        .then(data => {
            setMahasiswa(data.data || data); 
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            if (err.message.includes('Sesi habis')) {
                localStorage.removeItem('token');
                router.push('/login');
            }
            setLoading(false);
        });

    }, [router]);

    // --- 2. Logout ---
    const handleLogout = () => {
        if(confirm('Yakin ingin keluar dari sistem?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_name');
            router.push('/login');
        }
    };

    // --- 3. Delete ---
    const handleDelete = async (id) => {
        if (!confirm('Hapus data mahasiswa ini secara permanen?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`https://hafid.copium.id/api/mahasiswa/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setMahasiswa(mahasiswa.filter((mhs) => mhs.id !== id));
            } else {
                alert('Gagal menghapus data');
            }
        } catch (err) {
            alert('Terjadi kesalahan server');
        }
    };

    return (
        <div style={styles.container}>
            {/* Styles Global untuk Reset & Font */}
            <style jsx global>{`
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* --- TOP NAVBAR --- */}
            <nav style={styles.navbar}>
                <div style={styles.navContent}>
                    <div style={styles.brand}>
                        <span style={styles.logoIcon}>🎓</span>
                        Kampus App
                    </div>
                    <div style={styles.profileSection}>
                        <div style={styles.userBadge}>
                            <div style={styles.avatarSmall}>{userName ? userName.charAt(0).toUpperCase() : 'U'}</div>
                            <span style={styles.userName}>{userName || 'Admin'}</span>
                        </div>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            Keluar
                        </button>
                    </div>
                </div>
            </nav>

            <main style={styles.mainContent}>
                
                {/* --- HEADER SECTION --- */}
                <div style={styles.pageHeader}>
                    <div>
                        <h1 style={styles.pageTitle}>Dashboard Mahasiswa</h1>
                        <p style={styles.pageSubtitle}>Kelola data akademik mahasiswa aktif.</p>
                    </div>
                    <Link href="/dashboard/create">
                        <button style={styles.addBtn}>
                            + Tambah Mahasiswa
                        </button>
                    </Link>
                </div>

                {/* --- STATS OVERVIEW --- */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Mahasiswa</div>
                        <div style={styles.statValue}>{mahasiswa.length}</div>
                        <div style={styles.statDesc}>Mahasiswa terdaftar dalam sistem</div>
                    </div>
                    {/* Placeholder untuk stat lain */}
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Status Sistem</div>
                        <div style={styles.statValueActive}>Online</div>
                        <div style={styles.statDesc}>Semua layanan berjalan normal</div>
                    </div>
                </div>

                {/* --- TABS NAVIGASI --- */}
                <div style={styles.tabsContainer}>
                    <button style={styles.tabActive}>Mahasiswa</button>
                    <Link href="/dashboard/dosen" style={{textDecoration: 'none'}}>
                        <button style={styles.tabInactive}>Dosen Pengajar</button>
                    </Link>
                </div>

                {/* --- DATA TABLE / LIST --- */}
                <div style={styles.tableCard}>
                    {loading ? (
                        <div style={styles.loadingState}>
                            <div style={styles.spinner}></div>
                            <p>Memuat data...</p>
                        </div>
                    ) : (
                        <>
                            {mahasiswa.length > 0 ? (
                                <div style={styles.tableWrapper}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr style={styles.tableHeadRow}>
                                                <th style={styles.th}>Mahasiswa</th>
                                                <th style={styles.th}>NIM</th>
                                                <th style={styles.th}>Program Studi</th>
                                                <th style={styles.th}>Kontak</th>
                                                <th style={{...styles.th, textAlign: 'right'}}>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mahasiswa.map((mhs) => (
                                                <tr key={mhs.id} style={styles.tableRow}>
                                                    <td style={styles.td}>
                                                        <div style={styles.userCell}>
                                                            <div style={styles.avatarTable}>{mhs.nama.charAt(0).toUpperCase()}</div>
                                                            <div style={styles.nameText}>{mhs.nama}</div>
                                                        </div>
                                                    </td>
                                                    <td style={styles.td}>{mhs.nim}</td>
                                                    <td style={styles.td}>
                                                        {/* Handle jika data prodi object atau string */}
                                                        {typeof mhs.program_studi === 'object' 
                                                            ? mhs.program_studi?.program_studi 
                                                            : mhs.program_studi || '-'}
                                                    </td>
                                                    <td style={styles.td}>
                                                        <div style={{fontSize: '13px', color: '#6b7280'}}>{mhs.email}</div>
                                                        <div style={{fontSize: '12px', color: '#9ca3af'}}>{mhs.nomor_hp}</div>
                                                    </td>
                                                    <td style={{...styles.td, textAlign: 'right'}}>
                                                        <Link href={`/dashboard/edit/${mhs.id}`}>
                                                            <button style={styles.actionBtnEdit}>Edit</button>
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleDelete(mhs.id)}
                                                            style={styles.actionBtnDelete}
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div style={styles.emptyState}>
                                    <div style={{fontSize: '40px', marginBottom: '10px'}}>📭</div>
                                    <h3>Belum ada data</h3>
                                    <p>Silakan tambah data mahasiswa baru.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

// --- MODERN STYLES ---
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f9fafb', // Light Gray Background
        color: '#111827',
    },
    // Navbar
    navbar: {
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
    },
    navContent: {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brand: {
        fontWeight: '700',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#111827',
    },
    logoIcon: {
        background: '#eff6ff',
        padding: '6px',
        borderRadius: '8px',
        fontSize: '16px',
    },
    profileSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    userBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    avatarSmall: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#111827',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: '600',
    },
    userName: {
        fontSize: '14px',
        fontWeight: '500',
    },
    logoutBtn: {
        fontSize: '13px',
        color: '#ef4444',
        background: 'transparent',
        border: '1px solid #fee2e2',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    
    // Main Content
    mainContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
        animation: 'fadeIn 0.5s ease-out',
    },
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
    },
    pageTitle: {
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 8px 0',
        color: '#111827',
    },
    pageSubtitle: {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0,
    },
    addBtn: {
        backgroundColor: '#111827', // Black Button
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.1s',
    },

    // Stats
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
    },
    statCard: {
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    statLabel: {
        fontSize: '13px',
        color: '#6b7280',
        fontWeight: '500',
        marginBottom: '8px',
    },
    statValue: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '4px',
    },
    statValueActive: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#10b981', // Green
        marginBottom: '4px',
    },
    statDesc: {
        fontSize: '13px',
        color: '#9ca3af',
    },

    // Tabs
    tabsContainer: {
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '1px',
    },
    tabActive: {
        background: 'transparent',
        border: 'none',
        borderBottom: '2px solid #111827',
        padding: '10px 4px',
        fontWeight: '600',
        color: '#111827',
        fontSize: '14px',
        cursor: 'default',
        marginBottom: '-1px',
    },
    tabInactive: {
        background: 'transparent',
        border: 'none',
        padding: '10px 4px',
        fontWeight: '500',
        color: '#6b7280',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'color 0.2s',
    },

    // Table
    tableCard: {
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        textAlign: 'left',
    },
    tableHeadRow: {
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
    },
    th: {
        padding: '16px 24px',
        fontWeight: '600',
        color: '#374151',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    tableRow: {
        borderBottom: '1px solid #f3f4f6',
        transition: 'background-color 0.1s',
    },
    td: {
        padding: '16px 24px',
        color: '#111827',
        verticalAlign: 'middle',
    },
    userCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatarTable: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: '#eef2ff',
        color: '#4f46e5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '600',
        fontSize: '14px',
    },
    nameText: {
        fontWeight: '600',
        color: '#111827',
    },
    
    // Actions
    actionBtnEdit: {
        background: 'transparent',
        border: 'none',
        color: '#2563eb',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer',
        padding: '4px 8px',
        marginRight: '8px',
    },
    actionBtnDelete: {
        background: 'transparent',
        border: 'none',
        color: '#ef4444',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer',
        padding: '4px 8px',
    },
    
    // States
    loadingState: {
        padding: '60px',
        textAlign: 'center',
        color: '#6b7280',
    },
    spinner: {
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #111827',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 10px',
    },
    emptyState: {
        padding: '60px',
        textAlign: 'center',
        color: '#6b7280',
    },
};