
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import type { Project } from '../types';
import { Spinner } from './UI';

// --- PROJECT CARD ---
interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link to={`/project/${project.id}`} className="block group">
      <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-2xl">
        <img 
          src={project.thumbnail_url || `https://picsum.photos/seed/${project.id}/600/400`} 
          alt={project.title} 
          className="object-cover w-full h-48"
          loading="lazy"
        />
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 text-xs font-semibold text-primary-800 bg-primary-100 rounded-full dark:bg-gray-700 dark:text-primary-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

// --- PROJECT GRID ---
export const ProjectGrid: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
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
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (projects.length === 0) return <p className="text-center text-gray-500 dark:text-gray-400">No projects found.</p>

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

// --- PROJECT DETAIL ---
export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!project) return <p className="text-center text-gray-500 dark:text-gray-400">Project not found.</p>;

  const handleNext = () => {
    setActiveMediaIndex((prev) => (prev + 1) % project.media_urls.length);
  }

  const handlePrev = () => {
    setActiveMediaIndex((prev) => (prev - 1 + project.media_urls.length) % project.media_urls.length);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        {project.media_urls.length > 0 && (
          <div className="relative">
            <div className="w-full h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <img src={project.media_urls[activeMediaIndex]} alt={`${project.title} media ${activeMediaIndex + 1}`} className="object-contain h-full w-full" />
            </div>
            {project.media_urls.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity">
                    &#10094;
                </button>
                <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity">
                    &#10095;
                </button>
              </>
            )}
          </div>
        )}
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">{project.title}</h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map(tag => (
              <span key={tag} className="px-3 py-1 text-sm font-semibold text-primary-800 bg-primary-100 rounded-full dark:bg-gray-700 dark:text-primary-300">
                {tag}
              </span>
            ))}
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
            <p>{project.description}</p>
          </div>
           <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">Storage Provider: <span className="font-semibold">{project.storage_provider}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
