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

    // --- UI State (Untuk Animasi Hover/Focus) ---
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [focusedInput, setFocusedInput] = useState(null);

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
                
                if (data.user) {
                    localStorage.setItem('user_name', data.user.name);
                }

                router.push('/dashboard'); 
            } else {
                setError(data.message || 'Email atau password salah.');
            }

        } catch (err) {
            setError('Gagal menghubungi server. Cek koneksi internet Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* --- Global Keyframes --- */}
            <style jsx global>{`
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes slideUp {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `}</style>

            {/* --- Dekorasi Background (Blobs) --- */}
            <div style={styles.blob1}></div>
            <div style={styles.blob2}></div>

            <div style={styles.card}>
                
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
                    <h1 style={styles.title}>Welcome Back!</h1>
                    <p style={styles.subtitle}>Silakan masuk ke akun Kampus App Anda</p>
                </div>

                {/* Pesan Error dengan Animasi Shake */}
                {error && (
                    <div style={styles.errorBox}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    {/* Input Email */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput(null)}
                            required
                            placeholder="username/email"
                            style={{
                                ...styles.input,
                                ...(focusedInput === 'email' ? styles.inputFocus : {})
                            }}
                        />
                    </div>

                    {/* Input Password */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedInput('password')}
                            onBlur={() => setFocusedInput(null)}
                            required
                            placeholder="••••••••"
                            style={{
                                ...styles.input,
                                ...(focusedInput === 'password' ? styles.inputFocus : {})
                            }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        onMouseEnter={() => setIsButtonHovered(true)}
                        onMouseLeave={() => setIsButtonHovered(false)}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {}),
                            ...(isButtonHovered && !loading ? styles.buttonHover : {})
                        }}
                    >
                        {loading ? 'Sedang Memproses...' : 'Masuk Dashboard'}
                    </button>
                </form>

                <div style={styles.footer}>
                    &copy; 2025 Sistem Informasi Akademik
                </div>
            </div>
        </div>
    );
}

// --- Styles Object ---
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        fontFamily: "'Inter', sans-serif",
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
    },
    blob1: {
        position: 'absolute',
        top: '5%',
        left: '15%',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        zIndex: 0,
    },
    blob2: {
        position: 'absolute',
        bottom: '5%',
        right: '15%',
        width: '350px',
        height: '350px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        zIndex: 0,
    },
    card: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '50px 40px',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '420px',
        zIndex: 1,
        border: '1px solid rgba(255, 255, 255, 0.6)',
        animation: 'slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)', 
    },
    title: {
        color: '#1e293b', 
        margin: '0', 
        fontSize: '28px', 
        fontWeight: '800',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        color: '#64748b', 
        margin: '8px 0 0 0', 
        fontSize: '14px',
        fontWeight: '500',
    },
    errorBox: {
        background: 'rgba(254, 226, 226, 0.9)',
        color: '#b91c1c',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '25px',
        fontSize: '14px',
        textAlign: 'center',
        border: '1px solid #fca5a5',
        animation: 'shake 0.5s ease-in-out',
        fontWeight: '500',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#334155',
        fontSize: '13px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    
    // --- PERBAIKAN DI SINI (Memecah shorthand border) ---
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        
        // Pecah properti border:
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#e2e8f0',
        
        fontSize: '15px',
        outline: 'none',
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        color: '#334155',
    },
    
    inputFocus: {
        borderColor: '#2563eb', // Sekarang aman karena borderColor sudah didefinisikan terpisah di atas
        backgroundColor: '#ffffff',
        boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)',
    },
    button: {
        width: '100%',
        padding: '16px',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
        transform: 'translateY(0)',
    },
    buttonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 15px 25px -5px rgba(37, 99, 235, 0.4)',
        filter: 'brightness(1.1)',
    },
    buttonDisabled: {
        background: '#94a3b8',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
    },
    footer: {
        marginTop: '30px', 
        textAlign: 'center', 
        fontSize: '12px', 
        color: '#94a3b8',
        fontWeight: '500',
    }
};