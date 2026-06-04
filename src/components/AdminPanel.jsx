import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUpload, FaTrash, FaLock, FaUnlock, FaImages, FaSave, FaPlus } from 'react-icons/fa';
import { projects } from '../data/profileData';
import './AdminPanel.css';

const STORAGE_KEY = 'portfolio_project_images';
const ADMIN_KEY = 'portfolio_admin_auth';

function getStoredImages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveStoredImages(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Failed to save images to localStorage:', err);
    return false;
  }
}

// Compress image to reduce size before storing in localStorage
function compressImage(dataUrl, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Scale down if larger than maxWidth
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl); // fallback to original if error
    img.src = dataUrl;
  });
}

export function useProjectImages() {
  const [images, setImages] = useState(getStoredImages);

  useEffect(() => {
    const handleStorage = () => setImages(getStoredImages());
    window.addEventListener('storage', handleStorage);
    window.addEventListener('projectImagesUpdated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('projectImagesUpdated', handleStorage);
    };
  }, []);

  return images;
}

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_KEY) === 'true');
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [images, setImages] = useState(getStoredImages);
  const [selectedProject, setSelectedProject] = useState(null);
  const [toast, setToast] = useState('');
  const fileRef = useRef(null);

  // Secret key combo: Ctrl+Shift+A
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password - change this to your own
    if (password === '020902') {
      setAuthed(true);
      sessionStorage.setItem(ADMIN_KEY, 'true');
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const handleLogout = () => {
    setAuthed(false);
    sessionStorage.removeItem(ADMIN_KEY);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!selectedProject || files.length === 0) return;

    const pid = String(selectedProject);
    showToast(`Processing ${files.length} image(s)...`);

    let successCount = 0;

    for (const file of files) {
      try {
        // Read file as data URL
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        // Compress the image to save localStorage space
        const compressed = await compressImage(dataUrl);

        // Read fresh state from localStorage to avoid race conditions
        const freshImages = getStoredImages();
        if (!freshImages[pid]) freshImages[pid] = [];
        freshImages[pid].push(compressed);

        // Try to save - catch quota errors
        const saved = saveStoredImages(freshImages);
        if (!saved) {
          showToast('⚠️ Storage full! Try smaller images or delete existing ones.');
          break;
        }

        // Update React state with fresh data
        setImages({ ...freshImages });
        window.dispatchEvent(new Event('projectImagesUpdated'));
        successCount++;
      } catch (err) {
        console.error('Error processing file:', file.name, err);
      }
    }

    if (successCount > 0) {
      showToast(`✅ ${successCount} image(s) uploaded successfully!`);
    }

    e.target.value = '';
  };

  const removeImage = (pid, idx) => {
    const currentImages = { ...images };
    currentImages[pid] = currentImages[pid].filter((_, i) => i !== idx);
    if (currentImages[pid].length === 0) delete currentImages[pid];
    setImages(currentImages);
    saveStoredImages(currentImages);
    window.dispatchEvent(new Event('projectImagesUpdated'));
    showToast('Image removed');
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const projectImages = selectedProject ? (images[String(selectedProject)] || []) : [];

  return (
    <>
      {/* Floating admin button */}
      <button
        className="admin-fab"
        onClick={() => setOpen(true)}
        aria-label="Admin Panel"
        title="Admin Panel (Ctrl+Shift+A)"
      >
        <FaLock />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="admin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="admin-panel"
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="admin-panel__header">
                <h2 className="admin-panel__title">
                  <FaImages /> Admin Panel
                </h2>
                <button className="admin-panel__close" onClick={() => setOpen(false)}>
                  <FaTimes />
                </button>
              </div>

              {!authed ? (
                <form className="admin-login" onSubmit={handleLogin}>
                  <div className="admin-login__icon"><FaLock /></div>
                  <p className="admin-login__text">Enter admin password</p>
                  <input
                    type="password"
                    className="contact__input"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
                    placeholder="Password"
                    autoFocus
                  />
                  {pwError && <p className="admin-login__error">Wrong password</p>}
                  <button type="submit" className="neon-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
                    <FaUnlock /><span>Login</span>
                  </button>

                </form>
              ) : (
                <div className="admin-body">
                  <div className="admin-body__top">
                    <p className="admin-body__status">
                      <span className="admin-body__status-dot" /> Authenticated
                    </p>
                    <button className="admin-body__logout" onClick={handleLogout}>Logout</button>
                  </div>

                  <label className="admin-body__label">Select Project</label>
                  <select
                    className="admin-select"
                    value={selectedProject || ''}
                    onChange={(e) => setSelectedProject(e.target.value)}
                  >
                    <option value="">-- Choose a project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>

                  {selectedProject && (
                    <>
                      <div className="admin-upload-area">
                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                        <button
                          className="admin-upload-btn"
                          onClick={() => fileRef.current?.click()}
                        >
                          <FaPlus />
                          <span>Add Images</span>
                        </button>
                        <p className="admin-upload-hint">
                          Select multiple images. Stored in browser localStorage.
                        </p>
                      </div>

                      <div className="admin-images">
                        <label className="admin-body__label">
                          Images ({projectImages.length})
                        </label>
                        {projectImages.length === 0 ? (
                          <p className="admin-images__empty">No images yet</p>
                        ) : (
                          <div className="admin-images__grid">
                            {projectImages.map((img, i) => (
                              <div key={i} className="admin-image-thumb">
                                <img src={img} alt={`Project img ${i + 1}`} />
                                <button
                                  className="admin-image-thumb__del"
                                  onClick={() => removeImage(selectedProject, i)}
                                  aria-label="Remove image"
                                >
                                  <FaTrash />
                                </button>
                                <span className="admin-image-thumb__num">{i + 1}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              <AnimatePresence>
                {toast && (
                  <motion.div
                    className="admin-toast"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    {toast}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
