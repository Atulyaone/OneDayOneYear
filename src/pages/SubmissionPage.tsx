import { useState, type FormEvent } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SubmissionPage() {
  const [formData, setFormData] = useState({
    contributorName: '',
    historicalDate: '',
    description: '',
    mediaFile: null as string | null,
    mediaName: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          mediaFile: reader.result as string,
          mediaName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formData.contributorName || !formData.historicalDate || !formData.description) {
      setError('Please fill out all required fields before submitting.');
      return;
    }

    setError('');

    const existingSubmissions = JSON.parse(localStorage.getItem('archive_submissions') || '[]');
    const newSubmission = {
      id: Date.now(),
      contributorName: formData.contributorName,
      historicalDate: formData.historicalDate,
      description: formData.description,
      mediaName: formData.mediaName || 'None',
      mediaData: formData.mediaFile,
      submittedAt: new Date().toISOString(),
    };
    
    existingSubmissions.push(newSubmission);
    localStorage.setItem('archive_submissions', JSON.stringify(existingSubmissions));

    setSuccessMessage(true);

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newSubmission, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `submission_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <main className="page-shell paper-surface" style={{ minHeight: '100vh', width: '100vw', padding: '7rem clamp(1.5rem, 6vw, 8rem) 5rem', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/calendar" className="text-action">
          <ArrowLeft size={15} /> Return to Calendar
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        <span className="eyebrow">ARCHIVE PORTAL / RECORD SUBMISSION</span>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', margin: '0.5rem 0 1rem' }}>Contribute to the Archive</h1>
        <p style={{ marginBottom: '3rem', color: 'var(--ink-soft)', fontSize: '1.1rem' }}>
          Submit a historical record, note, or optional photographic/video evidence to be catalogued into the system.
        </p>

        {successMessage ? (
          <div style={{ padding: '3rem', background: 'rgba(168,139,85,0.15)', border: '1px solid var(--gold)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Submission Received Successfully!</h3>
            <p style={{ marginBottom: '2rem' }}>Your data and optional media file reference have been saved locally, and the JSON report has downloaded.</p>
            <button 
              type="button" 
              onClick={() => { 
                setSuccessMessage(false); 
                setFormData({ contributorName: '', historicalDate: '', description: '', mediaFile: null, mediaName: '' }); 
              }}
              style={{ padding: '1rem 2rem', background: 'var(--ink)', color: 'var(--paper)', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
            >
              Submit Another Record
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem', textAlign: 'left' }}>
            {error && <p style={{ color: '#783b2f', fontWeight: 'bold', padding: '1rem', background: 'rgba(120,59,47,0.1)', borderLeft: '4px solid #783b2f' }}>{error}</p>}

            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Name / Researcher *</label>
              <input 
                type="text" 
                placeholder="e.g., Dr. E. Vance"
                value={formData.contributorName}
                onChange={(e) => setFormData({ ...formData, contributorName: e.target.value })}
                style={{ padding: '1rem', border: '1px solid var(--ink-soft)', background: 'transparent', color: 'inherit', fontSize: '1rem', width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Historical Date *</label>
              <input 
                type="date" 
                value={formData.historicalDate}
                onChange={(e) => setFormData({ ...formData, historicalDate: e.target.value })}
                style={{ padding: '1rem', border: '1px solid var(--ink-soft)', background: 'transparent', color: 'inherit', fontSize: '1rem', width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Record Description & Notes *</label>
              <textarea 
                rows={6}
                placeholder="Describe the moment or historical significance..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ padding: '1rem', border: '1px solid var(--ink-soft)', background: 'transparent', color: 'inherit', fontSize: '1rem', resize: 'vertical', width: '100%' }}
              />
            </div>

            {/* CUSTOM STYLED FILE UPLOAD SECTION */}
            <div style={{ display: 'grid', gap: '0.8rem', padding: '1.5rem', border: '1px dashed var(--ink-soft)', background: 'rgba(240,232,215,0.4)' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Optional Evidence (Image or Video File)
              </label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Hidden native input coupled with custom styled label button */}
                <label style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.75rem 1.25rem', 
                  background: 'var(--ink)', 
                  color: 'var(--paper)', 
                  cursor: 'pointer', 
                  fontSize: '0.85rem', 
                  fontWeight: 600, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  transition: 'opacity 0.2s'
                }}>
                  <Upload size={16} /> Choose File
                  <input 
                    type="file" 
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                
                <span style={{ fontSize: '0.9rem', color: formData.mediaName ? 'var(--red)' : 'var(--ink-soft)', fontStyle: formData.mediaName ? 'normal' : 'italic' }}>
                  {formData.mediaName ? `Attached: ${formData.mediaName}` : 'No file chosen (Optional)'}
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              style={{ padding: '1.2rem', background: 'var(--ink)', color: 'var(--paper)', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}
            >
              Submit and Save JSON
            </button>
          </form>
        )}
      </div>
    </main>
  );
}