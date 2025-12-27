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

    // --- LOGIC SUBMIT DENGAN DETEKSI ERROR DETAIL ---
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
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json' // Tambahkan ini agar Laravel kirim JSON error
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('✨ Berhasil menambah mahasiswa!');
                router.push('/dashboard');
            } else {
                // --- PERBAIKAN DI SINI: BACA ERROR VALIDASI ---
                if (data.errors) {
                    // Ambil pesan error pertama dari Laravel
                    const firstField = Object.keys(data.errors)[0];
                    const firstMsg = data.errors[firstField][0];
                    setError(`Gagal: ${firstMsg} (${firstField})`);
                } else {
                    setError(data.message || 'Gagal menyimpan data.');
                }
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi ke server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <style jsx global>{`
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; }
            `}</style>

            <div style={styles.card}>
                {/* Header Section */}
                <div style={styles.cardHeader}>
                    <div>
                        <h1 style={styles.title}>Tambah Mahasiswa</h1>
                        <p style={styles.subtitle}>Isi formulir di bawah untuk menambahkan data mahasiswa baru.</p>
                    </div>
                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <button style={styles.backBtn}>Kembali</button>
                    </Link>
                </div>

                {error && (
                    <div style={styles.errorBox}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={styles.formGrid}>
                    
                    {/* Menggunakan Grid Layout agar rapi (2 Kolom) */}
                    <div style={styles.gridContainer}>
                        
                        {/* --- KOLOM KIRI (Akademik & Pribadi Utama) --- */}
                        <div style={styles.column}>
                            <h3 style={styles.sectionTitle}>Data Akademik</h3>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>NIM <span style={{color:'#ef4444'}}>*</span></label>
                                <input 
                                    type="text" name="nim" maxLength="13" 
                                    value={formData.nim} onChange={handleChange} required 
                                    style={styles.input} placeholder="Contoh: 2023001" 
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nama Lengkap <span style={{color:'#ef4444'}}>*</span></label>
                                <input 
                                    type="text" name="nama" 
                                    value={formData.nama} onChange={handleChange} required 
                                    style={styles.input} placeholder="Nama Lengkap"
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Program Studi <span style={{color:'#ef4444'}}>*</span></label>
                                <select 
                                    name="program_studi_id" 
                                    value={formData.program_studi_id} onChange={handleChange} required 
                                    style={styles.input}
                                >
                                    <option value="">- Pilih Program Studi -</option>
                                    {listProdi.map((prodi) => (
                                        <option key={prodi.id} value={prodi.id}>
                                            {prodi.program_studi}
                                        </option>
                                    ))}
                                </select>
                            </div>

                             <div style={styles.inputGroup}>
                                <label style={styles.label}>Jenis Kelamin <span style={{color:'#ef4444'}}>*</span></label>
                                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} style={styles.input}>
                                    <option value="1">Laki-laki</option>
                                    <option value="0">Perempuan</option>
                                </select>
                            </div>
                        </div>

                        {/* --- KOLOM KANAN (Kontak & Lahir) --- */}
                        <div style={styles.column}>
                            <h3 style={styles.sectionTitle}>Data Pribadi & Kontak</h3>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email <span style={{color:'#ef4444'}}>*</span></label>
                                <input 
                                    type="email" name="email" 
                                    value={formData.email} onChange={handleChange} required 
                                    style={styles.input} placeholder="mahasiswa@kampus.ac.id"
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nomor HP <span style={{color:'#ef4444'}}>*</span></label>
                                <input 
                                    type="text" name="nomor_hp" 
                                    value={formData.nomor_hp} onChange={handleChange} required 
                                    style={styles.input} placeholder="0812..."
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Tempat Lahir</label>
                                    <input 
                                        type="text" name="tempat_lahir" 
                                        value={formData.tempat_lahir} onChange={handleChange} required 
                                        style={styles.input} 
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Tgl Lahir</label>
                                    <input 
                                        type="date" name="tanggal_lahir" 
                                        value={formData.tanggal_lahir} onChange={handleChange} required 
                                        style={styles.input} 
                                    />
                                </div>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Golongan Darah</label>
                                <select name="golongan_darah" value={formData.golongan_darah} onChange={handleChange} style={styles.input}>
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
                        <button type="submit" disabled={loading} style={loading ? styles.submitBtnDisabled : styles.submitBtn}>
                            {loading ? 'Menyimpan...' : 'Simpan Data Mahasiswa'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

// --- STYLES (Clean & Modern) ---
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
    },
    card: {
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '900px',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        border: '1px solid #e5e7eb',
    },
    cardHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '24px'
    },
    title: { fontSize: '24px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' },
    subtitle: { fontSize: '14px', color: '#6b7280', margin: 0 },
    backBtn: {
        backgroundColor: 'white', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '8px', color: '#374151', fontWeight: '500', cursor: 'pointer', fontSize: '14px'
    },
    errorBox: {
        backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', border: '1px solid #fee2e2'
    },
    
    // Form Layout
    formGrid: { display: 'flex', flexDirection: 'column', gap: '32px' },
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '40px',
    },
    column: { display: 'flex', flexDirection: 'column', gap: '20px' },
    sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#111827', borderLeft: '4px solid #111827', paddingLeft: '12px', marginBottom: '8px' },
    
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
    input: {
        padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', color: '#111827', backgroundColor: '#f9fafb', outline: 'none', width: '100%', boxSizing: 'border-box'
    },
    
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #e5e7eb' },
    submitBtn: {
        backgroundColor: '#111827', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    },
    submitBtnDisabled: {
        backgroundColor: '#9ca3af', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'not-allowed',
    }
};