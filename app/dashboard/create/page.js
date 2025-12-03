'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateMahasiswa() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [listProdi, setListProdi] = useState([]); 

    // --- State Form ---
    const [formData, setFormData] = useState({
        nim: '',
        nama: '',
        program_studi_id: '',
        email: '',
        nomor_hp: '',
        jenis_kelamin: '1',
        tempat_lahir: '',
        tanggal_lahir: '',
        golongan_darah: ''
    });

    // --- 1. Fetch Data Prodi ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetch('https://hafid.copium.id/api/program-studis', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setListProdi(data.data || data); 
        })
        .catch(err => console.error("Gagal ambil prodi:", err));
    }, [router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const token = localStorage.getItem('token');
        
        try {
            const res = await fetch('https://hafid.copium.id/api/mahasiswa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('✨ Berhasil menambah mahasiswa!');
                router.push('/dashboard');
            } else {
                setError(data.message || 'Gagal menyimpan data.');
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
             {/* Styles Global untuk Animasi */}
             <style jsx global>{`
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Background Blobs */}
            <div style={styles.blob1}></div>
            <div style={styles.blob2}></div>

            <div style={styles.glassPanel}>
                {/* Header Section */}
                <div style={styles.header}>
                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <button style={styles.backBtn}>← Kembali</button>
                    </Link>
                    <h1 style={styles.title}>Tambah Mahasiswa</h1>
                </div>

                <p style={styles.subtitle}>Isi formulir di bawah untuk menambahkan data mahasiswa baru ke sistem.</p>
                <hr style={styles.divider} />

                {error && (
                    <div style={styles.errorBox}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    
                    {/* Menggunakan Grid Layout agar rapi (2 Kolom) */}
                    <div style={styles.gridContainer}>
                        
                        {/* --- KOLOM KIRI (Akademik & Pribadi Utama) --- */}
                        <div style={styles.column}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>NIM <span style={{color:'#ef4444'}}>*</span></label>
                                <input 
                                    type="text" name="nim" maxLength="13" 
                                    value={formData.nim} onChange={handleChange} required 
                                    style={styles.input} placeholder="Contoh: 2023001" 
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nama Lengkap <span style={{color:'#ef4444'}}>*</span></label>
                                <input 
                                    type="text" name="nama" 
                                    value={formData.nama} onChange={handleChange} required 
                                    style={styles.input} placeholder="Nama Lengkap"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Program Studi <span style={{color:'#ef4444'}}>*</span></label>
                                <select 
                                    name="program_studi_id" 
                                    value={formData.program_studi_id} onChange={handleChange} required 
                                    style={styles.select}
                                >
                                    <option value="">- Pilih Program Studi -</option>
                                    {listProdi.map((prodi) => (
                                        <option key={prodi.id} value={prodi.id}>
                                            {prodi.program_studi}
                                        </option>
                                    ))}
                                </select>
                            </div>

                             <div style={styles.formGroup}>
                                <label style={styles.label}>Jenis Kelamin <span style={{color:'#ef4444'}}>*</span></label>
                                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} style={styles.select}>
                                    <option value="1">Laki-laki</option>
                                    <option value="0">Perempuan</option>
                                </select>
                            </div>
                        </div>

                        {/* --- KOLOM KANAN (Kontak & Lahir) --- */}
                        <div style={styles.column}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email <span style={{color:'#ef4444'}}>*</span></label>
                                <input 
                                    type="email" name="email" 
                                    value={formData.email} onChange={handleChange} required 
                                    style={styles.input} placeholder="mahasiswa@kampus.ac.id"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nomor HP <span style={{color:'#ef4444'}}>*</span></label>
                                <input 
                                    type="text" name="nomor_hp" 
                                    value={formData.nomor_hp} onChange={handleChange} required 
                                    style={styles.input} placeholder="0812..."
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{...styles.formGroup, flex: 1}}>
                                    <label style={styles.label}>Tempat Lahir</label>
                                    <input 
                                        type="text" name="tempat_lahir" 
                                        value={formData.tempat_lahir} onChange={handleChange} required 
                                        style={styles.input} 
                                    />
                                </div>
                                <div style={{...styles.formGroup, flex: 1}}>
                                    <label style={styles.label}>Tgl Lahir</label>
                                    <input 
                                        type="date" name="tanggal_lahir" 
                                        value={formData.tanggal_lahir} onChange={handleChange} required 
                                        style={styles.input} 
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Golongan Darah</label>
                                <select name="golongan_darah" value={formData.golongan_darah} onChange={handleChange} style={styles.select}>
                                    <option value="">- Pilih -</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div style={styles.buttonGroup}>
                        <button type="submit" disabled={loading} style={styles.saveBtn}>
                            {loading ? '⏳ Menyimpan...' : '💾 Simpan Data'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

// --- STYLES OBJECT ---
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
        alignItems: 'flex-start', // Agar form panjang bisa di-scroll
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
        background: 'rgba(255, 255, 255, 0.95)', // Sedikit lebih solid agar form terbaca jelas
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '900px', // Lebih lebar untuk 2 kolom
        padding: '50px',
        zIndex: 1,
        animation: 'slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        marginBottom: '50px',
    },
    header: {
        display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '10px'
    },
    title: {
        margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '800',
    },
    subtitle: {
        color: '#64748b', fontSize: '14px', marginBottom: '20px', marginLeft: '5px'
    },
    divider: {
        border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '30px',
    },
    backBtn: {
        background: 'transparent', border: '1px solid #e2e8f0', padding: '8px 15px', borderRadius: '8px',
        cursor: 'pointer', color: '#64748b', fontWeight: '600', transition: 'all 0.2s', fontSize: '13px'
    },
    errorBox: {
        background: '#fee2e2', color: '#b91c1c', padding: '15px', borderRadius: '12px',
        marginBottom: '25px', fontSize: '14px', border: '1px solid #fca5a5', fontWeight: '500'
    },
    // Grid System
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Responsif: jadi 1 kolom di HP, 2 di Desktop
        gap: '30px',
        marginBottom: '30px',
    },
    column: {
        display: 'flex', flexDirection: 'column', gap: '20px'
    },
    formGroup: {
        display: 'flex', flexDirection: 'column', gap: '8px',
    },
    label: {
        fontSize: '13px', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px'
    },
    input: {
        padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
        fontSize: '15px', background: '#f8fafc', transition: 'all 0.2s', outline: 'none',
        color: '#1e293b', width: '100%', boxSizing: 'border-box' // Penting agar tidak overflow
    },
    select: {
        padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
        fontSize: '15px', background: '#f8fafc', transition: 'all 0.2s', outline: 'none',
        color: '#1e293b', width: '100%', cursor: 'pointer', appearance: 'none' // Modern select
    },
    buttonGroup: {
        display: 'flex', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #f1f5f9'
    },
    saveBtn: {
        padding: '14px 40px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '16px',
        cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', transition: 'transform 0.2s',
    },
};