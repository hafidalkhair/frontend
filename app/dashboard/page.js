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
            if (res.status === 401) {
                throw new Error('Sesi habis, silakan login lagi.');
            }
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

    // --- 2. Fungsi Logout ---
    const handleLogout = () => {
        if(confirm('Yakin ingin keluar?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_name');
            router.push('/login');
        }
    };

    // --- 3. Fungsi Delete ---
    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch(`https://hafid.copium.id/api/mahasiswa/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (res.ok) {
                // Hapus dari state tanpa reload
                setMahasiswa(mahasiswa.filter((mhs) => mhs.id !== id));
            } else {
                alert('Gagal menghapus data');
            }
        } catch (err) {
            console.error(err);
            alert('Terjadi kesalahan server');
        }
    };

    return (
        <div style={styles.container}>
            {/* Styles Global untuk Keyframes */}
            <style jsx global>{`
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
            `}</style>

            {/* Background Blobs */}
            <div style={styles.blob1}></div>
            <div style={styles.blob2}></div>

            <div style={styles.glassPanel}>
                
                {/* --- HEADER --- */}
                <header style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Dashboard Admin</h1>
                        <p style={styles.subtitle}>👋 Halo, <strong>{userName || 'User'}</strong></p>
                    </div>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Log Out 
                    </button>
                </header>

                <hr style={styles.divider} />

                {/* --- STATS CARD (Hiasan) --- */}
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <span style={{fontSize: '24px'}}>👨‍🎓</span>
                        <div>
                            <div style={{fontSize: '12px', color: '#64748b'}}>Total Mahasiswa</div>
                            <div style={{fontSize: '20px', fontWeight: 'bold', color: '#1e293b'}}>{mahasiswa.length}</div>
                        </div>
                    </div>
                </div>

                {/* --- NAVIGATION & ACTION --- */}
                <div style={styles.actionBar}>
                    <div style={styles.navGroup}>
                        <button style={styles.navBtnActive}>
                            Data Mahasiswa
                        </button>
                        <Link href="/dashboard/dosen">
                            <button style={styles.navBtnInactive}>
                                Data Dosen
                            </button>
                        </Link>
                    </div>

                    <Link href="/dashboard/create">
                        <button style={styles.addBtn}>
                            + Tambah Baru
                        </button>
                    </Link>
                </div>
                
                {/* --- LIST DATA --- */}
                <div style={styles.listContainer}>
                    {loading ? (
                        <div style={styles.loadingState}>
                            <div style={styles.spinner}></div>
                            <p>Sedang memuat data...</p>
                        </div>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {mahasiswa.length > 0 ? (
                                mahasiswa.map((mhs, index) => (
                                    <li 
                                        key={mhs.id || index} 
                                        style={{
                                            ...styles.listItem,
                                            animationDelay: `${index * 0.1}s` // Efek muncul bergantian
                                        }}
                                    >
                                        <div style={styles.itemInfo}>
                                            <div style={styles.avatar}>{mhs.nama.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <div style={styles.itemName}>{mhs.nama}</div>
                                                <div style={styles.itemSub}>NIM: {mhs.nim}</div>
                                                <div style={styles.itemSub}>{mhs.email}</div>
                                            </div>
                                        </div>

                                        <div style={styles.itemActions}>
                                            <Link href={`/dashboard/edit/${mhs.id}`}>
                                                <button style={styles.editBtn}>Edit</button>
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(mhs.id)}
                                                style={styles.deleteBtn}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <div style={styles.emptyState}>
                                    <p>📭 Belum ada data mahasiswa.</p>
                                </div>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- STYLES (JAVASCRIPT OBJECT) ---
const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        padding: '40px 20px',
        fontFamily: "'Inter', sans-serif",
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
    },
    blob1: {
        position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px',
        background: 'rgba(255, 255, 255, 0.3)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0,
    },
    blob2: {
        position: 'absolute', bottom: '10%', right: '5%', width: '300px', height: '300px',
        background: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0,
    },
    glassPanel: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '900px',
        padding: '40px',
        zIndex: 1,
        height: 'fit-content',
        animation: 'slideIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px',
    },
    title: {
        margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '800',
    },
    subtitle: {
        margin: '5px 0 0 0', color: '#64748b', fontSize: '14px',
    },
    logoutBtn: {
        padding: '10px 20px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s',
    },
    divider: {
        border: 'none', borderTop: '1px solid #e2e8f0', margin: '20px 0',
    },
    statsContainer: {
        display: 'flex', gap: '15px', marginBottom: '30px',
    },
    statCard: {
        background: '#f8fafc', padding: '15px 20px', borderRadius: '12px',
        display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e2e8f0',
        minWidth: '200px',
    },
    actionBar: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px'
    },
    navGroup: {
        display: 'flex', gap: '10px', background: '#f1f5f9', padding: '5px', borderRadius: '10px',
    },
    navBtnActive: {
        padding: '8px 20px', background: 'white', color: '#2563eb', border: 'none',
        borderRadius: '8px', fontWeight: '600', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'default',
    },
    navBtnInactive: {
        padding: '8px 20px', background: 'transparent', color: '#64748b', border: 'none',
        borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
    },
    addBtn: {
        padding: '12px 24px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600',
        cursor: 'pointer', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)', transition: 'transform 0.2s',
    },
    listContainer: {
        marginTop: '20px',
    },
    listItem: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'white', padding: '20px', borderRadius: '16px', marginBottom: '12px',
        border: '1px solid #f1f5f9', transition: 'transform 0.2s, box-shadow 0.2s',
        animation: 'slideIn 0.5s ease forwards', opacity: 0, // Default opacity 0 for animation
    },
    itemInfo: {
        display: 'flex', alignItems: 'center', gap: '15px',
    },
    avatar: {
        width: '45px', height: '45px', borderRadius: '50%', background: '#e0f2fe',
        color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 'bold', fontSize: '18px',
    },
    itemName: {
        fontWeight: '700', color: '#334155', fontSize: '16px',
    },
    itemSub: {
        color: '#94a3b8', fontSize: '13px',
    },
    itemActions: {
        display: 'flex', gap: '8px',
    },
    editBtn: {
        padding: '8px 16px', background: '#f0f9ff', color: '#0ea5e9', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
    },
    deleteBtn: {
        padding: '8px 16px', background: '#fef2f2', color: '#ef4444', border: 'none',
        borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px',
    },
    loadingState: {
        textAlign: 'center', padding: '50px', color: '#64748b',
    },
    spinner: {
        width: '30px', height: '30px', border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb',
        borderRadius: '50%', margin: '0 auto 15px', animation: 'spin 1s linear infinite',
    },
    emptyState: {
        textAlign: 'center', padding: '40px', color: '#94a3b8', background: '#f8fafc', borderRadius: '12px',
    }
};