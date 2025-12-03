'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditDosen() {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // Ambil ID dari URL

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [listProdi, setListProdi] = useState([]);

    // Data Enum
    const listJabatan = ['tenaga pengajar', 'asisten ahli', 'lektor', 'lektor kepala', 'guru besar'];
    const listStatus = ['aktif', 'cuti', 'ijin belajar', 'tugas di instansi lain', 'tugas belajar'];

    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nidn: '',
        nip: '',
        tmt: '',
        jenis_kelamin: '1',
        program_studi_id: '',
        jabatan_fungsional: 'tenaga pengajar',
        status: 'aktif',
        bidang_keilmuan: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Ambil List Prodi
                const resProdi = await fetch('https://hafid.copium.id/api/program-studis', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataProdi = await resProdi.json();
                setListProdi(Array.isArray(dataProdi) ? dataProdi : dataProdi.data || []);

                // 2. Ambil Data Dosen by ID
                const resDosen = await fetch(`https://hafid.copium.id/api/dosens/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const dataDosen = await resDosen.json();
                const dosen = dataDosen.data || dataDosen;

                // 3. Set Form Data
                setFormData({
                    nama_lengkap: dosen.nama_lengkap,
                    nidn: dosen.nidn || '',
                    nip: dosen.nip || '',
                    tmt: dosen.tmt || '',
                    jenis_kelamin: dosen.jenis_kelamin ? '1' : '0',
                    program_studi_id: dosen.program_studi_id || '',
                    jabatan_fungsional: dosen.jabatan_fungsional,
                    status: dosen.status,
                    bidang_keilmuan: dosen.bidang_keilmuan || ''
                });
                
                setLoading(false);

            } catch (err) {
                console.error(err);
                setError('Gagal mengambil data. Cek koneksi internet.');
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

        // Logic null untuk data opsional
        const payload = { ...formData };
        if (!payload.nidn) payload.nidn = null;
        if (!payload.nip) payload.nip = null;
        if (!payload.tmt) payload.tmt = null;

        try {
            const res = await fetch(`https://hafid.copium.id/api/dosens/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Data Dosen berhasil diperbarui!');
                router.push('/dashboard/dosen');
            } else {
                setError(data.message || 'Gagal update data.');
            }
        } catch (err) {
            setError('Terjadi kesalahan koneksi.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Global Animation Styles */}
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
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            <div style={styles.blob1}></div>
            <div style={styles.blob2}></div>

            <div style={styles.glassPanel}>
                
                {/* --- HEADER --- */}
                <div style={styles.header}>
                    <Link href="/dashboard/dosen" style={{ textDecoration: 'none' }}>
                        <button style={styles.backBtn}>← Batal</button>
                    </Link>
                    <h1 style={styles.title}>Edit Dosen</h1>
                </div>

                <p style={styles.subtitle}>Perbarui informasi data dosen pengajar di bawah ini.</p>
                <hr style={styles.divider} />

                {error && <div style={styles.errorBox}>⚠️ {error}</div>}

                {loading ? (
                    <div style={styles.loadingState}>
                        <div style={styles.spinner}></div>
                        <p>Sedang mengambil data...</p>
                    </div>
                ) : (
                    <form onSubmit={handleUpdate}>
                        
                        {/* Grid Layout (Kiri & Kanan) */}
                        <div style={styles.gridContainer}>
                            
                            {/* KOLOM KIRI (Identitas & Akademik) */}
                            <div style={styles.column}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Nama Lengkap</label>
                                    <input 
                                        type="text" name="nama_lengkap" 
                                        value={formData.nama_lengkap} onChange={handleChange} required 
                                        style={styles.input} 
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{...styles.formGroup, flex: 1}}>
                                        <label style={styles.label}>NIDN</label>
                                        <input 
                                            type="text" name="nidn" maxLength="10"
                                            value={formData.nidn} onChange={handleChange} 
                                            style={styles.input} placeholder="Opsional"
                                        />
                                    </div>
                                    <div style={{...styles.formGroup, flex: 1}}>
                                        <label style={styles.label}>NIP</label>
                                        <input 
                                            type="text" name="nip" maxLength="18"
                                            value={formData.nip} onChange={handleChange} 
                                            style={styles.input} placeholder="Opsional"
                                        />
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Program Studi</label>
                                    <select 
                                        name="program_studi_id" 
                                        value={formData.program_studi_id} onChange={handleChange} 
                                        style={styles.select}
                                    >
                                        <option value="">- Pilih Prodi (Opsional) -</option>
                                        {listProdi.map((prodi) => (
                                            <option key={prodi.id} value={prodi.id}>
                                                {prodi.program_studi}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Bidang Keilmuan</label>
                                    <input 
                                        type="text" name="bidang_keilmuan" 
                                        value={formData.bidang_keilmuan} onChange={handleChange} 
                                        style={styles.input} 
                                    />
                                </div>
                            </div>

                            {/* KOLOM KANAN (Jabatan & Status) */}
                            <div style={styles.column}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Jabatan Fungsional</label>
                                    <select name="jabatan_fungsional" value={formData.jabatan_fungsional} onChange={handleChange} style={styles.select}>
                                        {listJabatan.map(j => (
                                            <option key={j} value={j}>{j.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Status Dosen</label>
                                    <select name="status" value={formData.status} onChange={handleChange} style={styles.select}>
                                        {listStatus.map(s => (
                                            <option key={s} value={s}>{s.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Jenis Kelamin</label>
                                    <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} style={styles.select}>
                                        <option value="1">Laki-laki</option>
                                        <option value="0">Perempuan</option>
                                    </select>
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>TMT (Mulai Tugas)</label>
                                    <input 
                                        type="date" name="tmt" 
                                        value={formData.tmt} onChange={handleChange} 
                                        style={styles.input} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div style={styles.buttonGroup}>
                            <button type="submit" disabled={submitting} style={styles.saveBtn}>
                                {submitting ? '⏳ Mengupdate...' : '💾 Update Data'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// --- STYLES OBJECT (Konsisten) ---
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
        alignItems: 'flex-start',
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
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '900px',
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
    loadingState: {
        textAlign: 'center', padding: '50px', color: '#64748b',
    },
    spinner: {
        width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #2563eb',
        borderRadius: '50%', margin: '0 auto 20px', animation: 'spin 1s linear infinite',
    },
    gridContainer: {
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '30px',
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
        color: '#1e293b', width: '100%', boxSizing: 'border-box'
    },
    select: {
        padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1',
        fontSize: '15px', background: '#f8fafc', transition: 'all 0.2s', outline: 'none',
        color: '#1e293b', width: '100%', cursor: 'pointer', appearance: 'none'
    },
    buttonGroup: {
        display: 'flex', justifyContent: 'flex-end', paddingTop: '20px', borderTop: '1px solid #f1f5f9'
    },
    saveBtn: {
        padding: '14px 40px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Orange untuk Edit
        color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '16px',
        cursor: 'pointer', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)', transition: 'transform 0.2s',
    },
};