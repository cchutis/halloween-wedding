'use client'

import React, { useState, useEffect } from 'react';
import { getTopScores, submitScore } from '@/lib/leaderboard';

export default function TestFirebase() {
    const [status, setStatus] = useState('Testing Firebase connection...');
    const [scores, setScores] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        testFirebase();
    }, []);

    const testFirebase = async () => {
        try {
            setStatus('Attempting to fetch scores...');
            const fetchedScores = await getTopScores(5);
            setScores(fetchedScores);
            setStatus('✅ Firebase connection successful!');
            setError(null);
        } catch (err: any) {
            console.error('Firebase test error:', err);
            setError(err.message || 'Unknown error');
            setStatus('❌ Firebase connection failed');
        }
    };

    const testSubmit = async () => {
        try {
            setStatus('Testing score submission...');
            await submitScore('Test Player', 1000);
            setStatus('✅ Score submission successful!');
            // Refresh scores
            await testFirebase();
        } catch (err: any) {
            console.error('Submit test error:', err);
            setError(err.message || 'Unknown error');
            setStatus('❌ Score submission failed');
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>Firebase Connection Test</h1>
            <p><strong>Status:</strong> {status}</p>
            
            {error && (
                <div style={{ background: '#ffebee', padding: '1rem', margin: '1rem 0', borderRadius: '4px' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}
            
            <button onClick={testFirebase} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
                Test Fetch Scores
            </button>
            
            <button onClick={testSubmit} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
                Test Submit Score
            </button>
            
            {scores.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>Current Scores:</h3>
                    <pre>{JSON.stringify(scores, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
