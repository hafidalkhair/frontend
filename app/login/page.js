'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    
    // --- Logic State ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- UI State ---
    const [hover, setHover] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('https://hafid.copium.id/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success || data.token) {
                const token = data.token || data.access_token;
                localStorage.setItem('token', token);
                if (data.user) localStorage.setItem('user_name', data.user.name);
                router.push('/dashboard'); 
            } else {
                setError(data.message || 'Kredensial tidak valid.');
            }
        } catch (err) {
            setError('Gagal terhubung ke server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Simple CSS Reset & Animation */}
            <style jsx global>{`
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div style={styles.card}>
                {/* Header Minimalis */}
                <div style={styles.header}>
                    <div style={styles.logoIcon}>🎓</div>
                    <h1 style={styles.title}>Masuk Akun</h1>
                    <p style={styles.subtitle}>Masukkan detail akun Anda untuk melanjutkan.</p>
                </div>

                {/* Pesan Error Simple */}
                {error && (
                    <div style={styles.errorBox}>
                        <span style={{marginRight: '8px'}}>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="name@example.com"
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <div style={styles.labelRow}>
                            <label style={styles.label}>Password</label>
                            {/* Opsional: Link Lupa Password */}
                            <a href="#" style={styles.forgotPass}>Lupa password?</a>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Masukan password"
                            style={styles.input}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        style={{
                            ...styles.button,
                            ...(hover ? styles.buttonHover : {}),
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                    >
                        {loading ? 'Memuat...' : 'Masuk sekarang'}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Belum punya akun? <a href="#" style={styles.link}>Hubungi Admin</a>
                </p>
            </div>
            
            <div style={styles.copyright}>
                &copy; 2025 Kampus App. All rights reserved.
            </div>
        </div>
    );
}

// --- Modern Minimalist Styles ---
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb', // Light Gray (sangat bersih)
        color: '#111827',
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)', // Shadow sangat halus
        border: '1px solid #e5e7eb', // Border tipis abu-abu
        animation: 'fadeIn 0.5s ease-out',
    },
    header: {
        marginBottom: '32px',
        textAlign: 'center',
    },
    logoIcon: {
        fontSize: '32px',
        marginBottom: '16px',
        display: 'inline-block',
        background: '#eff6ff',
        padding: '12px',
        borderRadius: '12px',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 8px 0',
        color: '#111827',
        letterSpacing: '-0.025em',
    },
    subtitle: {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0,
        lineHeight: '1.5',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
    },
    forgotPass: {
        fontSize: '12px',
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: '500',
    },
    input: {
        padding: '12px 16px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        fontSize: '14px',
        color: '#111827',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        backgroundColor: '#f9fafb',
    },
    errorBox: {
        backgroundColor: '#fef2f2',
        border: '1px solid #fee2e2',
        color: '#991b1b',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
    },
    button: {
        marginTop: '10px',
        padding: '12px',
        backgroundColor: '#111827', // Hitam/Dark Slate (sangat modern)
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    buttonHover: {
        backgroundColor: '#000000',
        transform: 'translateY(-1px)',
    },
    buttonDisabled: {
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed',
        transform: 'none',
    },
    footerText: {
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#6b7280',
    },
    link: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: '600',
    },
    copyright: {
        marginTop: '40px',
        fontSize: '12px',
        color: '#9ca3af',
    }
};