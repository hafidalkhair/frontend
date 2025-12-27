'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditMahasiswa() {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // Ambil ID dari URL

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [listProdi, setListProdi] = useState([]);

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // --- FETCH DATA PARALLEL (Prodi & Mahasiswa) ---
        const fetchData = async () => {
            try {
                // 1. Ambil List Prodi
                const resProdi = await fetch('https://hafid.copium.id/api/program-studis', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataProdi = await resProdi.json();
                setListProdi(dataProdi.data || dataProdi);

                // 2. Ambil Data Mahasiswa by ID
                const resMhs = await fetch(`https://hafid.copium.id/api/mahasiswa/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!resMhs.ok) throw new Error('Data mahasiswa tidak ditemukan.');
                
                const dataMhs = await resMhs.json();
                const mhs = dataMhs.data || dataMhs;

                // 3. Masukkan data ke Form
                setFormData({
                    nim: mhs.nim || '',
                    nama: mhs.nama || '',
                    program_studi_id: mhs.program_studi_id || '',
                    email: mhs.email || '',
                    nomor_hp: mhs.nomor_hp || '',
                    jenis_kelamin: mhs.jenis_kelamin ? '1' : '0',
                    tempat_lahir: mhs.tempat_lahir || '',
                    tanggal_lahir: mhs.tanggal_lahir || '', 
                    golongan_darah: mhs.golongan_darah || ''
                });

                setLoading(false);

            } catch (err) {
                console.error(err);
                setError('Gagal mengambil data. Pastikan koneksi aman.');
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        const token = localStorage.getItem('token');

        try {
            // Method PUT untuk Update
            const res = await fetch(`https://hafid.copium.id/api/mahasiswa/${id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json' // Penting: Agar error return JSON
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Data berhasil diperbarui!');
                router.push('/dashboard');
            } else {
                // Tangkap Pesan Error Validasi dari Laravel
                if (data.errors) {
                    const firstField = Object.keys(data.errors)[0];
                    setError(`Gagal: ${data.errors[firstField][0]}`);
                } else {
                    setError(data.message || 'Gagal update data.');
                }
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi ke server.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={styles.loadingScreen}>Memuat data...</div>;

    return (
        <div style={styles.container}>
            <style jsx global>{`
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; }
            `}</style>

            <div style={styles.card}>
                
                {/* --- HEADER --- */}
                <div style={styles.cardHeader}>
                    <div>
                        <h1 style={styles.title}>Edit Mahasiswa</h1>
                        <p style={styles.subtitle}>Perbarui informasi data mahasiswa di bawah ini.</p>
                    </div>
                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <button style={styles.backBtn}>Kembali</button>
                    </Link>
                </div>

                {error && <div style={styles.errorBox}>⚠️ {error}</div>}

                <form onSubmit={handleUpdate} style={styles.formGrid}>
                    
                    {/* Grid Layout (Kiri & Kanan) */}
                    <div style={styles.gridContainer}>
                        
                        {/* KOLOM KIRI */}
                        <div style={styles.column}>
                            <h3 style={styles.sectionTitle}>Data Akademik</h3>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>NIM</label>
                                <input 
                                    type="text" name="nim" maxLength="13" 
                                    value={formData.nim} onChange={handleChange} required 
                                    style={styles.input} 
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nama Lengkap</label>
                                <input 
                                    type="text" name="nama" 
                                    value={formData.nama} onChange={handleChange} required 
                                    style={styles.input} 
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Program Studi</label>
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
                                <label style={styles.label}>Jenis Kelamin</label>
                                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} style={styles.input}>
                                    <option value="1">Laki-laki</option>
                                    <option value="0">Perempuan</option>
                                </select>
                            </div>
                        </div>

                        {/* KOLOM KANAN */}
                        <div style={styles.column}>
                            <h3 style={styles.sectionTitle}>Data Pribadi & Kontak</h3>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email</label>
                                <input 
                                    type="email" name="email" 
                                    value={formData.email} onChange={handleChange} required 
                                    style={styles.input} 
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nomor HP</label>
                                <input 
                                    type="text" name="nomor_hp" 
                                    value={formData.nomor_hp} onChange={handleChange} required 
                                    style={styles.input} 
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
                        <button type="submit" disabled={submitting} style={submitting ? styles.submitBtnDisabled : styles.submitBtn}>
                            {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- STYLES (Clean & Modern Admin Style) ---
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        justifyContent: 'center',
        padding: '40px 20px',
    },
    loadingScreen: {
        height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#6b7280'
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