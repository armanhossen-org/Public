import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Spinner, Button, PencilIcon, TrashIcon, GoogleIcon, GithubIcon } from './UI';
import { Project, StorageProvider } from '../types';
import type { Provider } from '@supabase/supabase-js';

// --- PROTECTED ROUTE ---
export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- LOGIN ---
export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [authMode, setAuthMode] = useState<'password' | 'magiclink'>('password');
    const navigate = useNavigate();
    const { session } = useAuth();

    useEffect(() => {
        if (session) {
            navigate('/admin');
        }
    }, [session, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            navigate('/admin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) throw error;
            setMessage("Check your email for the magic link!");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const handleOAuthLogin = async (provider: Provider) => {
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({ provider });
        if (error) {
            setError(error.message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Admin Access</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Sign in to manage your portfolio.</p>

                <form onSubmit={authMode === 'password' ? handleLogin : handleMagicLink} className="space-y-6">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
                        required
                    />
                    {authMode === 'password' && (
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white"
                            required
                        />
                    )}
                    
                    <Button type="submit" isLoading={loading} className="w-full py-3 text-base">
                        {authMode === 'password' ? 'Sign In' : 'Send Magic Link'}
                    </Button>
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {message && <p className="text-green-500 text-sm text-center">{message}</p>}
                </form>

                <div className="text-center my-4">
                    <button onClick={() => setAuthMode(authMode === 'password' ? 'magiclink' : 'password')} className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                        {authMode === 'password' ? 'Use Magic Link instead' : 'Sign in with password'}
                    </button>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button variant="secondary" onClick={() => handleOAuthLogin('google')} className="w-full !justify-start py-3 text-base pl-4">
                        <GoogleIcon className="mr-3 w-5 h-5" />
                        Sign in with Google
                    </Button>
                    <Button variant="secondary" onClick={() => handleOAuthLogin('github')} className="w-full !justify-start py-3 text-base pl-4">
                        <GithubIcon className="mr-3 w-5 h-5" />
                        Sign in with GitHub
                    </Button>
                </div>
            </div>
        </div>
    );
};

// --- DRAG-N-DROP UPLOAD ---
interface DndUploadProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}
const DndUpload: React.FC<DndUploadProps> = ({ files, setFiles }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files);
    if (newFiles && newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
     if (newFiles && newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
        <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary-500 bg-primary-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600'
        }`}
        onClick={() => document.getElementById('file-upload')?.click()}
        >
            <input type="file" id="file-upload" multiple className="hidden" onChange={handleFileChange} />
            <p className="text-gray-500 dark:text-gray-400">Drag & drop files here, or click to select</p>
        </div>
        {files.length > 0 && (
            <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                        <span className="text-sm truncate">{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                           <TrashIcon />
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};


// --- PROJECT FORM ---
interface ProjectFormProps {
    projectToEdit?: Project | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ projectToEdit, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [storageProvider, setStorageProvider] = useState<StorageProvider>(StorageProvider.SUPABASE);
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(projectToEdit) {
            setTitle(projectToEdit.title);
            setDescription(projectToEdit.description);
            setTags(projectToEdit.tags.join(', '));
            setStorageProvider(projectToEdit.storage_provider);
        }
    }, [projectToEdit]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const media_urls: string[] = projectToEdit?.media_urls || [];

            // Upload new files
            for (const file of files) {
                const filePath = `public/${Date.now()}-${file.name}`;
                const { error: uploadError } = await supabase.storage
                    .from('projects-media')
                    .upload(filePath, file);

                if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

                const { data: { publicUrl } } = supabase.storage
                    .from('projects-media')
                    .getPublicUrl(filePath);
                
                if(!publicUrl) throw new Error('Could not get public URL for uploaded file.');
                media_urls.push(publicUrl);
            }
            
            const projectData = {
                title,
                description,
                tags: tags.split(',').map(tag => tag.trim()),
                storage_provider: storageProvider,
                media_urls,
                thumbnail_url: media_urls[0] || projectToEdit?.thumbnail_url || null,
            };

            if (projectToEdit) {
                // Update
                const { error: updateError } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', projectToEdit.id);
                if (updateError) throw updateError;
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('projects')
                    .insert([projectData]);
                if (insertError) throw insertError;
            }
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">{projectToEdit ? 'Edit Project' : 'Add New Project'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 h-32" />
                    <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                    <select value={storageProvider} onChange={e => setStorageProvider(e.target.value as StorageProvider)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                        {Object.values(StorageProvider).map(provider => (
                            <option key={provider} value={provider}>{provider}</option>
                        ))}
                    </select>
                    
                    <DndUpload files={files} setFiles={setFiles} />

                    {error && <p className="text-red-500">{error}</p>}
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit" isLoading={loading}>{projectToEdit ? 'Update Project' : 'Create Project'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- ADMIN PANEL ---
export const AdminPanel: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setProjects(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleDelete = async (projectId: number, mediaUrls: string[]) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        
        try {
            // Delete from storage
            const filePaths = mediaUrls.map(url => {
                const parts = url.split('/projects-media/');
                return parts.length > 1 ? `public/${parts[1]}` : null;
            }).filter(Boolean) as string[];

            if(filePaths.length > 0) {
                const { error: storageError } = await supabase.storage
                .from('projects-media')
                .remove(filePaths);
                if (storageError) console.error("Storage deletion error: ", storageError.message);
            }

            // Delete from database
            const { error: dbError } = await supabase.from('projects').delete().eq('id', projectId);
            if (dbError) throw dbError;
            
            fetchProjects();
        } catch (err: any) {
            alert(`Error deleting project: ${err.message}`);
        }
    };
    
    const handleAddProject = () => {
        setProjectToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditProject = (project: Project) => {
        setProjectToEdit(project);
        setIsFormOpen(true);
    }
    
    const handleFormSuccess = () => {
        setIsFormOpen(false);
        fetchProjects();
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Button onClick={handleAddProject}>Add New Project</Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Tags</th>
                            <th scope="col" className="px-6 py-3">Created At</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{project.title}</td>
                                <td className="px-6 py-4">{project.tags.join(', ')}</td>
                                <td className="px-6 py-4">{new Date(project.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Button variant="secondary" onClick={() => handleEditProject(project)} className="p-2"><PencilIcon /></Button>
                                    <Button variant="danger" onClick={() => handleDelete(project.id, project.media_urls)} className="p-2"><TrashIcon /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {projects.length === 0 && <p className="p-6 text-center">No projects yet.</p>}
            </div>
            
            {isFormOpen && <ProjectForm projectToEdit={projectToEdit} onClose={() => setIsFormOpen(false)} onSuccess={handleFormSuccess} />}
        </div>
    );
};