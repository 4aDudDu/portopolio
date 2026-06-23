import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaTrash, FaLock, FaUnlock, FaImages,
  FaPlus, FaSpinner, FaExclamationTriangle, FaFolderOpen, FaCloudUploadAlt
} from 'react-icons/fa';
import { projects as hardcodedProjects, projectCategories } from '../data/profileData';
import {
  isCloudConfigured, fetchCloudData, saveCloudData,
} from '../lib/cloudStorage';
import './AdminPanel.css';

const ADMIN_KEY = 'portfolio_admin_auth';

/* ─── Public hooks ─────────────────────────────────────────── */
export function useProjectImages() {
  const [images, setImages] = useState({});
  const load = useCallback(async () => {
    if (!isCloudConfigured()) return;
    try { const d = await fetchCloudData(); setImages(d.images || {}); } catch {}
  }, []);
  useEffect(() => {
    load();
    window.addEventListener('cloudDataUpdated', load);
    return () => window.removeEventListener('cloudDataUpdated', load);
  }, [load]);
  return images;
}

export function useCustomProjects() {
  const [list, setList] = useState([]);
  const load = useCallback(async () => {
    if (!isCloudConfigured()) return;
    try { const d = await fetchCloudData(); setList(d.customProjects || []); } catch {}
  }, []);
  useEffect(() => {
    load();
    window.addEventListener('cloudDataUpdated', load);
    return () => window.removeEventListener('cloudDataUpdated', load);
  }, [load]);
  return list;
}

export function useProjectLinks() {
  const [links, setLinks] = useState({});
  const load = useCallback(async () => {
    if (!isCloudConfigured()) return;
    try { const d = await fetchCloudData(); setLinks(d.projectLinks || {}); } catch {}
  }, []);
  useEffect(() => {
    load();
    window.addEventListener('cloudDataUpdated', load);
    return () => window.removeEventListener('cloudDataUpdated', load);
  }, [load]);
  return links;
}

/* ─── Helpers ──────────────────────────────────────────────── */
function compressImage(file, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (ev) => {
      const img = new Image();
      img.src = ev.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
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
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}
const EMPTY_FORM = {
  title: '', category: 'Web', role: '',
  description: '', stack: '', features: '', link: '', github: '',
};

// Don't invalidateCache here — saveCloudData already updates the cache with fresh data.
// Invalidating would trigger a GitHub API refetch which may return stale data.
function dispatch() { window.dispatchEvent(new Event('cloudDataUpdated')); }

/* ─── Component ─────────────────────────────────────────────── */
export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(ADMIN_KEY) === 'true');
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState('images');

  // images tab
  const [images, setImages] = useState({});
  const [selProject, setSelProject] = useState('');
  const fileRef = useRef(null);

  // add-project tab
  const [form, setForm] = useState(EMPTY_FORM);
  const [newImgs, setNewImgs] = useState([]);
  const newFileRef = useRef(null);

  // custom projects & links
  const [customProjects, setCustomProjects] = useState([]);
  const [projectLinks, setProjectLinks] = useState({});

  // edit links tab
  const [linkForm, setLinkForm] = useState({ project: '', link: '', github: '' });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'ok' });
  const configured = isCloudConfigured();

  /* load data */
  const loadData = useCallback(async () => {
    if (!configured) return;
    try {
      const d = await fetchCloudData();
      setImages(d.images || {});
      setCustomProjects(d.customProjects || []);
      setProjectLinks(d.projectLinks || {});
    } catch { showToast('Failed to load cloud data', 'err'); }
  }, [configured]);

  useEffect(() => { if (authed && open) loadData(); }, [authed, open, loadData]);

  /* keyboard shortcut */
  useEffect(() => {
    const h = (e) => { if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); setOpen(true); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'ok' }), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '020902') { setAuthed(true); sessionStorage.setItem(ADMIN_KEY, 'true'); setPwError(false); }
    else setPwError(true);
  };

  const handleLogout = () => { setAuthed(false); sessionStorage.removeItem(ADMIN_KEY); };

  /* ── Images Tab ── */
  const allProjects = [...hardcodedProjects, ...customProjects];
  const curImgs = selProject ? (images[String(selProject)] || []) : [];

  const handleImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!selProject || !files.length) return;
    setLoading(true);
    showToast(`Mengupload ${files.length} gambar…`, 'info');
    try {
      // Compress & convert semua file ke Base64 secara paralel
      const results = await Promise.allSettled(files.map(f => compressImage(f)));
      const urls = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
      const failed = results.filter(r => r.status === 'rejected').length;

      if (urls.length === 0) {
        showToast('❌ Semua gambar gagal diproses.', 'err');
        return;
      }

      // Ambil data terbaru dari cache lalu append URL baru
      const d = await fetchCloudData();
      const pid = String(selProject);
      d.images[pid] = [...(d.images[pid] || []), ...urls];

      // Simpan ke GitHub Gist
      await saveCloudData(d);

      // Update state lokal langsung (tidak tunggu refetch)
      setImages(prev => ({ ...prev, [pid]: d.images[pid] }));
      dispatch();

      const msg = failed > 0
        ? `✅ ${urls.length} berhasil, ${failed} gagal`
        : `✅ ${urls.length} gambar berhasil diupload!`;
      showToast(msg);
    } catch (err) {
      console.error('Upload error:', err);
      showToast(`❌ ${err.message}`, 'err');
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const removeImg = async (pid, idx) => {
    setLoading(true);
    try {
      const d = await fetchCloudData();
      d.images[String(pid)] = (d.images[String(pid)] || []).filter((_, i) => i !== idx);
      if (!d.images[String(pid)].length) delete d.images[String(pid)];
      await saveCloudData(d);
      setImages({ ...d.images });
      dispatch();
      showToast('Image removed');
    } catch { showToast('Failed to remove', 'err'); }
    finally { setLoading(false); }
  };

  /* ── Add Project Tab ── */
  const handleNewImgUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setLoading(true); showToast(`Memproses ${files.length} gambar…`, 'info');
    try {
      const results = await Promise.allSettled(files.map(compressImage));
      const urls = results.filter(r => r.status === 'fulfilled').map(r => r.value);
      const failed = results.filter(r => r.status === 'rejected').length;
      if (urls.length > 0) setNewImgs(prev => [...prev, ...urls]);
      const msg = failed > 0 ? `✅ ${urls.length} berhasil, ${failed} gagal` : `✅ ${urls.length} gambar diupload!`;
      showToast(urls.length > 0 ? msg : '❌ Semua upload gagal', urls.length > 0 ? 'ok' : 'err');
    } catch (err) { showToast(`❌ ${err.message}`, 'err'); }
    finally { setLoading(false); e.target.value = ''; }
  };

  const handleAddProject = async (ev) => {
    ev.preventDefault();
    if (!form.title.trim()) return showToast('Title is required', 'err');
    setLoading(true);
    try {
      const d = await fetchCloudData();
      const id = `custom_${Date.now()}`;
      const proj = {
        id, title: form.title.trim(), category: form.category,
        role: form.role.trim(), description: form.description.trim(),
        stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
        features: form.features.split('\n').map(s => s.trim()).filter(Boolean),
        link: form.link.trim() || null, github: form.github.trim() || null, image: null,
      };
      d.customProjects = [...(d.customProjects || []), proj];
      if (newImgs.length) d.images[id] = newImgs;
      await saveCloudData(d);
      setCustomProjects([...d.customProjects]);
      setImages({ ...d.images });
      dispatch();
      setForm(EMPTY_FORM); setNewImgs([]);
      showToast('✅ Project added!'); setTab('myprojects');
    } catch { showToast('❌ Failed to add project', 'err'); }
    finally { setLoading(false); }
  };

  /* ── My Projects Tab ── */
  const deleteCustomProject = async (id) => {
    setLoading(true);
    try {
      const d = await fetchCloudData();
      d.customProjects = (d.customProjects || []).filter(p => p.id !== id);
      delete d.images[id];
      await saveCloudData(d);
      setCustomProjects([...d.customProjects]);
      setImages({ ...d.images });
      dispatch();
      showToast('Project deleted');
    } catch { showToast('Failed to delete', 'err'); }
    finally { setLoading(false); }
  };

  /* ── Edit Links Tab ── */
  const handleEditLinkLoad = (pid) => {
    setLinkForm({ project: pid, link: projectLinks[pid]?.link || '', github: projectLinks[pid]?.github || '' });
  };

  const handleSaveLinks = async (ev) => {
    ev.preventDefault();
    if (!linkForm.project) return showToast('Pilih project dulu', 'err');
    setLoading(true);
    try {
      const d = await fetchCloudData();
      if (!d.projectLinks) d.projectLinks = {};
      d.projectLinks[linkForm.project] = { link: linkForm.link.trim(), github: linkForm.github.trim() };
      await saveCloudData(d);
      setProjectLinks({ ...d.projectLinks });
      dispatch();
      showToast('✅ Links updated!');
    } catch { showToast('❌ Failed to save links', 'err'); }
    finally { setLoading(false); }
  };

  /* ── Render ── */
  return (
    <>
      <button className="admin-fab" onClick={() => setOpen(true)} aria-label="Admin Panel" title="Admin Panel (Ctrl+Shift+A)">
        <FaLock />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div className="admin-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div className="admin-panel" initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} transition={{ type: 'spring', damping: 25 }} onClick={(e) => e.stopPropagation()}>

              <div className="admin-panel__header">
                <h2 className="admin-panel__title"><FaImages /> Admin Panel</h2>
                <button className="admin-panel__close" onClick={() => setOpen(false)}><FaTimes /></button>
              </div>

              {!authed ? (
                <form className="admin-login" onSubmit={handleLogin}>
                  <div className="admin-login__icon"><FaLock /></div>
                  <p className="admin-login__text">Enter admin password</p>
                  <input type="password" className="contact__input" value={password}
                    onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
                    placeholder="Password" autoFocus />
                  {pwError && <p className="admin-login__error">Wrong password</p>}
                  <button type="submit" className="neon-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
                    <FaUnlock /><span>Login</span>
                  </button>
                </form>
              ) : (
                <div className="admin-body">
                  <div className="admin-body__top">
                    <p className="admin-body__status"><span className="admin-body__status-dot" /> Authenticated</p>
                    <button className="admin-body__logout" onClick={handleLogout}>Logout</button>
                  </div>

                  {!configured && (
                    <div className="admin-setup-warn">
                      <FaExclamationTriangle />
                      <div>
                        <strong>Cloud belum dikonfigurasi</strong>
                        <p>Set env vars berikut di Vercel & <code>.env.local</code>:</p>
                        <p><code>VITE_IMGBB_API_KEY</code> · <code>VITE_GITHUB_TOKEN</code> · <code>VITE_GIST_ID</code></p>
                        <a href="https://api.imgbb.com" target="_blank" rel="noopener noreferrer">ImgBB</a> ·{' '}
                        <a href="https://gist.github.com" target="_blank" rel="noopener noreferrer">GitHub Gist</a> ·{' '}
                        <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">Token</a>
                      </div>
                    </div>
                  )}

                  {/* Tabs */}
                  <div className="admin-tabs">
                    {[['images', <FaImages key="i" />, 'Images'], 
                      ['addproject', <FaPlus key="p" />, 'Add Project'], 
                      ['editlinks', <FaLock key="l" />, 'Edit Links'],
                      ['myprojects', <FaFolderOpen key="m" />, 'My Projects']].map(([id, icon, label]) => (
                      <button key={id} className={`admin-tab ${tab === id ? 'admin-tab--active' : ''}`} onClick={() => setTab(id)}>
                        {icon} <span>{label}</span>
                        {id === 'myprojects' && customProjects.length > 0 && (
                          <span className="admin-tab__badge">{customProjects.length}</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* ── TAB: Images ── */}
                  {tab === 'images' && (
                    <>
                      <label className="admin-body__label">Select Project</label>
                      <select className="admin-select" value={selProject} onChange={(e) => setSelProject(e.target.value)}>
                        <option value="">-- Choose a project --</option>
                        <optgroup label="Main Projects">
                          {hardcodedProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </optgroup>
                        {customProjects.length > 0 && (
                          <optgroup label="My Projects">
                            {customProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                          </optgroup>
                        )}
                      </select>

                      {selProject && (
                        <>
                          <div className="admin-upload-area">
                            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImgUpload} style={{ display: 'none' }} />
                            <button className="admin-upload-btn" onClick={() => fileRef.current?.click()} disabled={loading || !configured}>
                              {loading ? <FaSpinner className="spin" /> : <FaCloudUploadAlt />}
                              <span>{loading ? 'Uploading…' : 'Pilih Gambar'}</span>
                            </button>
                            <p className="admin-upload-hint">Gambar dikompres lalu disimpan ke Gist, pasti bisa diakses!</p>
                          </div>

                          <div className="admin-images">
                            <label className="admin-body__label">Images ({curImgs.length})</label>
                            {curImgs.length === 0
                              ? <p className="admin-images__empty">No images yet</p>
                              : <div className="admin-images__grid">
                                  {curImgs.map((url, i) => (
                                    <div key={i} className="admin-image-thumb">
                                      <img src={url} alt={`img ${i + 1}`} />
                                      <button className="admin-image-thumb__del" onClick={() => removeImg(selProject, i)} disabled={loading}><FaTrash /></button>
                                      <span className="admin-image-thumb__num">{i + 1}</span>
                                    </div>
                                  ))}
                                </div>
                            }
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* ── TAB: Add Project ── */}
                  {tab === 'addproject' && (
                    <form className="admin-form" onSubmit={handleAddProject}>
                      <div className="admin-form__row">
                        <label className="admin-body__label">Title *</label>
                        <input className="contact__input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Project title" required />
                      </div>

                      <div className="admin-form__row">
                        <label className="admin-body__label">Category</label>
                        <select className="admin-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                          {projectCategories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div className="admin-form__row">
                        <label className="admin-body__label">Role</label>
                        <input className="contact__input" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. Full-Stack Developer" />
                      </div>

                      <div className="admin-form__row">
                        <label className="admin-body__label">Description</label>
                        <textarea className="contact__input admin-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Project description…" rows={3} />
                      </div>

                      <div className="admin-form__row">
                        <label className="admin-body__label">Tech Stack <span className="admin-hint">(comma separated)</span></label>
                        <input className="contact__input" value={form.stack} onChange={e => setForm(f => ({ ...f, stack: e.target.value }))} placeholder="Laravel, MySQL, React" />
                      </div>

                      <div className="admin-form__row">
                        <label className="admin-body__label">Features <span className="admin-hint">(one per line)</span></label>
                        <textarea className="contact__input admin-textarea" value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} placeholder={"Feature 1\nFeature 2\nFeature 3"} rows={3} />
                      </div>

                      <div className="admin-form__row admin-form__row--2col">
                        <div>
                          <label className="admin-body__label">Live URL</label>
                          <input className="contact__input" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://…" />
                        </div>
                        <div>
                          <label className="admin-body__label">GitHub URL</label>
                          <input className="contact__input" value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} placeholder="https://github.com/…" />
                        </div>
                      </div>

                      <div className="admin-form__row">
                        <label className="admin-body__label">Project Images</label>
                        <input ref={newFileRef} type="file" accept="image/*" multiple onChange={handleNewImgUpload} style={{ display: 'none' }} />
                        <button type="button" className="admin-upload-btn" onClick={() => newFileRef.current?.click()} disabled={loading || !configured}>
                          {loading ? <FaSpinner className="spin" /> : <FaCloudUploadAlt />}
                          <span>{loading ? 'Uploading…' : 'Upload Images'}</span>
                        </button>
                        {newImgs.length > 0 && (
                          <div className="admin-images__grid" style={{ marginTop: 8 }}>
                            {newImgs.map((url, i) => (
                              <div key={i} className="admin-image-thumb">
                                <img src={url} alt={`new img ${i + 1}`} />
                                <button type="button" className="admin-image-thumb__del" onClick={() => setNewImgs(prev => prev.filter((_, j) => j !== i))}><FaTrash /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button type="submit" className="neon-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading || !configured}>
                        {loading ? <FaSpinner className="spin" /> : <FaPlus />}
                        <span>Add Project</span>
                      </button>
                    </form>
                  )}

                  {/* ── TAB: Edit Links ── */}
                  {tab === 'editlinks' && (
                    <form className="admin-form" onSubmit={handleSaveLinks}>
                      <label className="admin-body__label">Pilih Project</label>
                      <select className="admin-select" value={linkForm.project} onChange={(e) => handleEditLinkLoad(e.target.value)}>
                        <option value="">-- Choose a project --</option>
                        <optgroup label="Main Projects">
                          {hardcodedProjects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                        </optgroup>
                      </select>

                      {linkForm.project && (
                        <>
                          <div className="admin-form__row">
                            <label className="admin-body__label">Live URL</label>
                            <input className="contact__input" value={linkForm.link} onChange={e => setLinkForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
                          </div>
                          <div className="admin-form__row">
                            <label className="admin-body__label">GitHub URL</label>
                            <input className="contact__input" value={linkForm.github} onChange={e => setLinkForm(f => ({ ...f, github: e.target.value }))} placeholder="https://github.com/..." />
                          </div>
                          <button type="submit" className="neon-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={loading || !configured}>
                            {loading ? <FaSpinner className="spin" /> : <FaCloudUploadAlt />}
                            <span>Update Links</span>
                          </button>
                        </>
                      )}
                    </form>
                  )}

                  {/* ── TAB: My Projects ── */}
                  {tab === 'myprojects' && (
                    <div className="admin-myprojects">
                      {customProjects.length === 0
                        ? <p className="admin-images__empty">No custom projects yet.<br />Add one from the "Add Project" tab.</p>
                        : customProjects.map(p => (
                          <div key={p.id} className="admin-project-item">
                            <div className="admin-project-item__info">
                              <span className="admin-project-item__cat">{p.category}</span>
                              <strong>{p.title}</strong>
                              {p.role && <span className="admin-project-item__role">{p.role}</span>}
                              <span className="admin-project-item__imgs">{(images[p.id] || []).length} image(s)</span>
                            </div>
                            <button className="admin-project-item__del" onClick={() => deleteCustomProject(p.id)} disabled={loading}>
                              <FaTrash />
                            </button>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              )}

              <AnimatePresence>
                {toast.msg && (
                  <motion.div className={`admin-toast admin-toast--${toast.type}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                    {toast.msg}
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
