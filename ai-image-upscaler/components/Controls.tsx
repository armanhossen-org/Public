import React, { useState } from 'react';
import type { Settings, ScaleFactor, DPI, OutputFormat, Progress } from '../types';
import { cn } from '../lib/utils';
import { TrashIcon, DownloadIcon } from './icons';
import { Spinner } from './Spinner';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsPanelProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  onUpscale: () => void;
  onClear: () => void;
  onDownloadAll: () => void;
  canUpscale: boolean;
  canClear: boolean;
  canDownloadAll: boolean;
  isProcessing: boolean;
  queueCount: number;
  progress: Progress;
}

const Button = ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        className={cn(
            'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4 shadow-sm hover:shadow-md',
            className
        )}
        {...props}
    >
        {children}
    </button>
);

const SettingsGroup = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-border/60">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
                <h3 className="text-base font-semibold">{title}</h3>
                <motion.div animate={{ rotate: isOpen ? 0 : -90 }}>
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </motion.div>
            </button>
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="pb-6 space-y-4">{children}</div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

const ToggleButton = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <button onClick={() => onChange(!checked)} className={cn("relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card", checked ? 'bg-primary' : 'bg-secondary')}>
            <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", checked ? 'translate-x-5' : 'translate-x-0')} />
        </button>
    </div>
);


export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  setSettings,
  onUpscale,
  onClear,
  onDownloadAll,
  canUpscale,
  canClear,
  canDownloadAll,
  isProcessing,
  queueCount,
  progress,
}) => {
  const scaleFactors: ScaleFactor[] = [2, 4, 8, 16];
  const dpiOptions: DPI[] = [72, 150, 300, 600];
  const formatOptions: OutputFormat[] = ['PNG', 'JPEG', 'PDF'];

  const handleEnhancementChange = (key: keyof Settings['enhancements'], value: boolean) => {
    setSettings({ ...settings, enhancements: { ...settings.enhancements, [key]: value } });
  };
  
  const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  return (
    <aside className="lg:sticky lg:top-24 h-fit">
        <div className="glass-card border border-border/60 rounded-lg shadow-lg">
            <div className="p-6">
                <SettingsGroup title="Upscale Settings">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Scale Factor</label>
                        <div className="grid grid-cols-4 gap-2">
                            {scaleFactors.map(factor => (
                                <button key={factor} onClick={() => setSettings({ ...settings, scale: factor })}
                                    className={cn('p-2 text-sm rounded-md transition-colors', settings.scale === factor ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary hover:bg-accent')}>
                                    {factor}x
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Resolution (DPI)</label>
                        <div className="grid grid-cols-4 gap-2">
                            {dpiOptions.map(dpi => (
                                <button key={dpi} onClick={() => setSettings({ ...settings, dpi: dpi })}
                                    className={cn('p-2 text-sm rounded-md transition-colors', settings.dpi === dpi ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary hover:bg-accent')}>
                                    {dpi}
                                </button>
                            ))}
                        </div>
                    </div>
                </SettingsGroup>
                
                <SettingsGroup title="AI Enhancements">
                    {/* FIX: Wrap children in a single div. This seems to fix a subtle type-checking issue where multiple direct custom component children were causing errors. */}
                    <div className="space-y-4">
                        <ToggleButton label="Enhance Sharpness" checked={settings.enhancements.sharpness} onChange={(c) => handleEnhancementChange('sharpness', c)} />
                        <ToggleButton label="Reduce Noise" checked={settings.enhancements.noiseReduction} onChange={(c) => handleEnhancementChange('noiseReduction', c)} />
                        <ToggleButton label="Restore Faces" checked={settings.enhancements.faceRestore} onChange={(c) => handleEnhancementChange('faceRestore', c)} />
                        <ToggleButton label="Texture Boost" checked={settings.enhancements.textureBoost} onChange={(c) => handleEnhancementChange('textureBoost', c)} />
                    </div>
                </SettingsGroup>

                <SettingsGroup title="Export Options">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Output Format</label>
                        <div className="grid grid-cols-3 gap-2">
                            {formatOptions.map(format => (
                                <button key={format} onClick={() => setSettings({ ...settings, outputFormat: format })}
                                    className={cn('p-2 text-sm rounded-md transition-colors', settings.outputFormat === format ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary hover:bg-accent')}>
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>
                    <AnimatePresence>
                    {settings.outputFormat === 'JPEG' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="space-y-2 overflow-hidden"
                        >
                            <div className="flex justify-between items-center">
                                <label htmlFor="jpegQuality" className="text-sm font-medium text-muted-foreground">JPEG Quality</label>
                                <span className="text-sm font-mono bg-secondary px-2 py-1 rounded">{Math.round(settings.jpegQuality * 100)}</span>
                            </div>
                            <input
                                id="jpegQuality"
                                type="range"
                                min="0.1" max="1" step="0.01"
                                value={settings.jpegQuality}
                                onChange={e => setSettings({...settings, jpegQuality: parseFloat(e.target.value)})}
                                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </motion.div>
                    )}
                    </AnimatePresence>
                </SettingsGroup>
            </div>
            
            <div className="p-6 border-t border-border/60 space-y-4">
                {isProcessing && (
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <p className="text-muted-foreground truncate max-w-xs">Processing: <span className="text-foreground font-medium">{progress.currentFile}</span></p>
                            <p className="font-semibold">{progress.completed}/{progress.total}</p>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                            <motion.div
                                className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.3, ease: 'linear' }}
                            />
                        </div>
                    </div>
                )}
                 <Button
                    onClick={onUpscale}
                    disabled={!canUpscale || isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90 shadow-lg font-semibold"
                >
                    {isProcessing ? <Spinner className="w-5 h-5 mr-2" /> : <svg className="w-5 h-5 mr-2" xmlns="http://www.w.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M11.983 1.932a2.25 2.25 0 00-1.966 0L1.767 7.058a2.25 2.25 0 00-1.114 1.956v7.022c0 .964.62 1.803 1.503 2.112l8.25 2.894a2.25 2.25 0 001.188 0l8.25-2.894a2.25 2.25 0 001.503-2.112V9.014a2.25 2.25 0 00-1.114-1.956L11.983 1.932zM10 3.13l7.56 4.363-3.09 1.748L10 6.948l-4.47 2.293-3.09-1.748L10 3.13zM2.5 9.423l4.258 2.179-4.258 2.37V9.423zm15 0v4.549l-4.258-2.37L17.5 9.423zM10 16.87L3.931 14.58l4.47-2.293L10 13.052l1.6-.82 4.47 2.293L10 16.87z"/></svg>}
                    {isProcessing ? 'Processing...' : `Upscale (${queueCount})`}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                    <Button onClick={onDownloadAll} disabled={!canDownloadAll} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full">
                        <DownloadIcon className="w-4 h-4 mr-2" /> Download All
                    </Button>
                    <Button onClick={onClear} disabled={!canClear} className="bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full">
                        <TrashIcon className="w-4 h-4 mr-2" /> Clear All
                    </Button>
                </div>
            </div>
        </div>
    </aside>
  );
};
