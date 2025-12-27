'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditDosenPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id; // Ambil ID dari URL

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    // Data Master untuk Dropdown
    const [masterData, setMasterData] = useState({
        prodi: [],
        pangkat: [],
        kbk: []
    });

    // State Form
    const [formData, setFormData] = useState({
        nama_lengkap: '',
        nidn: '',
        nip: '',
        tmt: '',
        jenis_kelamin: '1',
        program_studi_id: '',
        pangkat_id: '',
        kelompok_bidang_keahlian_id: '',
        bidang_keilmuan: '',
        jabatan_fungsional: 'tenaga pengajar',
        status: 'aktif',
    });

    const [fileFoto, setFileFoto] = useState(null);
    const [previewFoto, setPreviewFoto] = useState(null);

    // --- 1. Fetch Data ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch Master Data & Detail Dosen
                const [resProdi, resPangkat, resKbk, resDosen] = await Promise.all([
                    fetch('https://hafid.copium.id/api/program-studis', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('https://hafid.copium.id/api/pangkats', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('https://hafid.copium.id/api/kelompok-bidang-keahlians', { headers: { 'Authorization': `Bearer ${token}` } }),
                    // PERBAIKAN: Gunakan 'dosens' (jamak)
                    fetch(`https://hafid.copium.id/api/dosens/${id}`, { 
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json' // Penting agar error return JSON
                        } 
                    })
                ]);

                // Cek Response Dosen
                if (!resDosen.ok) {
                    throw new Error('Gagal mengambil data dosen (Cek Route Backend)');
                }

                const dataProdi = await resProdi.json();
                const dataPangkat = await resPangkat.json();
                const dataKbk = await resKbk.json();
                const dataDosen = await resDosen.json();

                setMasterData({
                    prodi: dataProdi.data || dataProdi,
                    pangkat: dataPangkat.data || dataPangkat,
                    kbk: dataKbk.data || dataKbk
                });

                const d = dataDosen.data || dataDosen;
                setFormData({
                    nama_lengkap: d.nama_lengkap || '',
                    nidn: d.nidn || '',
                    nip: d.nip || '',
                    tmt: d.tmt || '',
                    jenis_kelamin: d.jenis_kelamin ? '1' : '0',
                    program_studi_id: d.program_studi_id || '',
                    pangkat_id: d.pangkat_id || '',
                    kelompok_bidang_keahlians_id: d.kelompok_bidang_keahlians_id || '', // Sesuaikan nama kolom jika beda
                    bidang_keilmuan: d.bidang_keilmuan || '',
                    jabatan_fungsional: d.jabatan_fungsional || 'tenaga pengajar',
                    status: d.status || 'aktif',
                });

                if (d.foto) setPreviewFoto(d.foto);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Gagal memuat data. ' + err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    // --- 2. Handle Change ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileFoto(file);
            setPreviewFoto(URL.createObjectURL(file));
        }
    };

    // --- 3. Submit (Update) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const token = localStorage.getItem('token');
        const payload = new FormData();

        payload.append('_method', 'PUT'); // Trick Laravel

        Object.keys(formData).forEach(key => {
            if ((formData[key] === '' || formData[key] === null) && 
                ['nidn', 'nip', 'tmt', 'bidang_keilmuan'].includes(key)) {
                return; 
            }
            payload.append(key, formData[key]);
        });

        if (fileFoto) {
            payload.append('foto', fileFoto);
        }

        try {
            // PERBAIKAN: Gunakan 'dosens' (jamak)
            const res = await fetch(`https://hafid.copium.id/api/dosens/${id}`, {
                method: 'POST', 
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: payload
            });

            const data = await res.json();

            if (res.ok) {
                alert('Data berhasil diperbarui!');
                router.push('/dashboard/dosen');
            } else {
                setError(data.message || 'Gagal memperbarui data.');
            }
        } catch (err) {
            setError('Terjadi kesalahan server.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={styles.loadingScreen}>Loading...</div>;

    return (
        <div style={styles.container}>
            <style jsx global>{`
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; }
            `}</style>

            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <div>
                        <h1 style={styles.title}>Edit Data Dosen</h1>
                        <p style={styles.subtitle}>Perbarui informasi akademik dan kepegawaian.</p>
                    </div>
                    <Link href="/dashboard/dosen" style={{textDecoration: 'none'}}>
                        <button style={styles.backBtn}>Kembali</button>
                    </Link>
                </div>

                {error && <div style={styles.errorBox}>⚠️ {error}</div>}

                <form onSubmit={handleSubmit} style={styles.formGrid}>
                    
                    {/* --- SEKSI 1: Identitas & Foto --- */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Identitas Diri</h3>
                        
                        <div style={styles.photoContainer}>
                            <div style={styles.avatarPreview}>
                                {previewFoto ? (
                                    <img src={previewFoto} alt="Preview" style={styles.avatarImg} />
                                ) : (
                                    <span style={{fontSize: '24px'}}>📷</span>
                                )}
                            </div>
                            <div style={{flex: 1}}>
                                <label style={styles.label}>Foto Profil (Opsional)</label>
                                <input type="file" onChange={handleFileChange} style={styles.input} accept="image/*" />
                                <p style={styles.helperText}>Biarkan kosong jika tidak ingin mengubah foto.</p>
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nama Lengkap *</label>
                            <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} style={styles.input} required />
                        </div>

                        <div style={styles.row}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>NIDN</label>
                                <input type="text" name="nidn" value={formData.nidn} onChange={handleChange} style={styles.input} placeholder="Opsional" />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>NIP</label>
                                <input type="text" name="nip" value={formData.nip} onChange={handleChange} style={styles.input} placeholder="Opsional" />
                            </div>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Jenis Kelamin</label>
                            <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} style={styles.input}>
                                <option value="1">Laki-laki</option>
                                <option value="0">Perempuan</option>
                            </select>
                        </div>
                    </div>

                    {/* --- SEKSI 2: Data Akademik --- */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Data Akademik</h3>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Program Studi</label>
                            <select name="program_studi_id" value={formData.program_studi_id} onChange={handleChange} style={styles.input}>
                                <option value="">- Pilih Prodi -</option>
                                {masterData.prodi.map(p => (
                                    <option key={p.id} value={p.id}>{p.program_studi}</option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Kelompok Bidang Keahlian (KBK)</label>
                            <select name="kelompok_bidang_keahlian_id" value={formData.kelompok_bidang_keahlian_id} onChange={handleChange} style={styles.input}>
                                <option value="">- Pilih KBK -</option>
                                {masterData.kbk.map(k => (
                                    <option key={k.id} value={k.id}>{k.nama_kelompok || k.nama}</option>
                                ))}
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Bidang Keilmuan Spesifik</label>
                            <input type="text" name="bidang_keilmuan" value={formData.bidang_keilmuan} onChange={handleChange} style={styles.input} placeholder="Contoh: Machine Learning" />
                        </div>
                    </div>

                    {/* --- SEKSI 3: Kepegawaian --- */}
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>Status Kepegawaian</h3>

                        <div style={styles.row}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Jabatan Fungsional</label>
                                <select name="jabatan_fungsional" value={formData.jabatan_fungsional} onChange={handleChange} style={styles.input}>
                                    {['tenaga pengajar', 'asisten ahli', 'lektor', 'lektor kepala', 'guru besar'].map(j => (
                                        <option key={j} value={j} style={{textTransform: 'capitalize'}}>{j}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Pangkat / Golongan</label>
                                <select name="pangkat_id" value={formData.pangkat_id} onChange={handleChange} style={styles.input}>
                                    <option value="">- Pilih Pangkat -</option>
                                    {masterData.pangkat.map(p => (
                                        <option key={p.id} value={p.id}>{p.nama_pangkat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
                                    {['aktif', 'cuti', 'ijin belajar', 'tugas belajar', 'keluar'].map(s => (
                                        <option key={s} value={s} style={{textTransform: 'capitalize'}}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>TMT (Terhitung Mulai Tanggal)</label>
                                <input type="date" name="tmt" value={formData.tmt} onChange={handleChange} style={styles.input} />
                            </div>
                        </div>
                    </div>

                    {/* --- BUTTONS --- */}
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

// --- STYLES (Clean & Modern) ---
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
        maxWidth: '800px',
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
    formGrid: { display: 'flex', flexDirection: 'column', gap: '32px' },
    section: { display: 'flex', flexDirection: 'column', gap: '20px' },
    sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#111827', borderLeft: '4px solid #111827', paddingLeft: '12px', marginBottom: '8px' },
    
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
    input: {
        padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', color: '#111827', backgroundColor: '#f9fafb', outline: 'none', width: '100%', boxSizing: 'border-box'
    },
    helperText: { fontSize: '12px', color: '#9ca3af', marginTop: '4px' },
    
    photoContainer: { display: 'flex', gap: '20px', alignItems: 'center', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px dashed #d1d5db' },
    avatarPreview: { width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', paddingTop: '24px', borderTop: '1px solid #e5e7eb' },
    submitBtn: {
        backgroundColor: '#111827', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
    },
    submitBtnDisabled: {
        backgroundColor: '#9ca3af', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'not-allowed',
    }
};