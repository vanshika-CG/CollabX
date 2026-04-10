import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react';

const Flashcards = () => {
    const [uploadFile, setUploadFile] = useState(null);
    const [mcqCount, setMcqCount] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mcqs, setMcqs] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) return alert("Please select a file.");
        
        setIsGenerating(true);
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('count', mcqCount);

        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }};
            const { data } = await axios.post('http://localhost:5000/api/flashcards/generate-file', formData, config);
            
            setMcqs(data.mcqs);
            setSelectedAnswers({});
        } catch(err) {
            alert(err.response?.data?.message || 'File parsing failed. Please try a different file.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSelectOption = (qIndex, option) => {
        setSelectedAnswers({ ...selectedAnswers, [qIndex]: option });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '3rem' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2>AI MCQ Quiz Generator</h2>
                <p style={{ color: 'var(--text-muted)' }}>Upload a PDF or Image, pick the number of questions, and let AI generate a quiz for you!</p>
            </div>

            <form onSubmit={handleFileUpload} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group">
                        <label className="input-label">Select Document (Image/PDF)</label>
                        <input 
                            type="file" 
                            className="input-field" 
                            accept=".pdf,image/*" 
                            onChange={(e) => setUploadFile(e.target.files[0])} 
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Max Questions</label>
                        <input 
                            type="number" 
                            className="input-field" 
                            min="1" 
                            max="20" 
                            value={mcqCount} 
                            onChange={(e) => setMcqCount(e.target.value)} 
                            required 
                        />
                    </div>
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={isGenerating || !uploadFile} style={{ padding: '0.8rem', display: 'flex', justifyContent: 'center' }}>
                    {isGenerating ? 'Scanning Document with AI...' : <><UploadCloud size={18} style={{ marginRight: '0.5rem' }}/> Generate Custom Quiz</>}
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {mcqs.map((q, idx) => (
                    <div key={idx} className="glass-card">
                        <h4 style={{ marginBottom: '1rem' }}>{idx + 1}. {q.question}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {q.options.map((opt, oIdx) => {
                                const isSelected = selectedAnswers[idx] === opt;
                                const isCorrect = opt === q.answer;
                                const showResult = !!selectedAnswers[idx]; // only show result if user picked an answer

                                let bgColor = 'var(--bg-surface)';
                                let borderColor = 'var(--border-color)';
                                if (showResult) {
                                    if (isCorrect) {
                                        bgColor = '#dcfce7'; borderColor = '#22c55e';
                                    } else if (isSelected) {
                                        bgColor = '#fee2e2'; borderColor = '#ef4444';
                                    }
                                } else if (isSelected) {
                                    borderColor = 'var(--primary)';
                                }

                                return (
                                    <button 
                                        key={oIdx}
                                        disabled={showResult}
                                        onClick={() => handleSelectOption(idx, opt)}
                                        style={{ 
                                            padding: '1rem', 
                                            borderRadius: '8px', 
                                            border: `1px solid ${borderColor}`, 
                                            background: bgColor, 
                                            textAlign: 'left',
                                            cursor: showResult ? 'default' : 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span>{opt}</span>
                                        {showResult && isCorrect && <CheckCircle size={18} color="#22c55e" />}
                                        {showResult && isSelected && !isCorrect && <XCircle size={18} color="#ef4444" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            
            {mcqs.length > 0 && Object.keys(selectedAnswers).length === mcqs.length && (
                <div style={{ marginTop: '2rem', textAlign: 'center', padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', fontWeight: 'bold' }}>
                    Quiz Complete! You got {Object.keys(selectedAnswers).filter(k => selectedAnswers[k] === mcqs[k].answer).length} out of {mcqs.length} correct.
                </div>
            )}
        </div>
    );
};

export default Flashcards;
