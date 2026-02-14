
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useTranslation } from '../App';

type Mode = 'video' | 'image' | 'edit';

export const VeoDemo: React.FC = () => {
  const { t } = useTranslation();
  
  // State for Modes
  const [mode, setMode] = useState<Mode>('video');

  // Shared / Video State
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  
  // Image Generation State
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');

  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const SAMPLE_PROMPT = "Cinematic abstract background, dark slate and obsidian, cyan glowing lines, high-tech server room aesthetic. 4K, Unreal Engine 5.";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setMimeType(file.type);
        setVideoUrl(null);
        setImageUrl(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkApiKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await aistudio.openSelectKey();
      }
      return true;
    }
    // Fallback if environment doesn't have aistudio wrapper (standard development)
    if (!process.env.API_KEY) {
       throw new Error("API Key missing.");
    }
    return true;
  };

  // Feature: Animate Images with Veo
  const handleGenerateVideo = async () => {
    if (!image) return;
    setError(null);
    setIsLoading(true);

    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Animate this image cinematically',
        image: {
          imageBytes: base64Data,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("No video URI returned");

      const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!videoRes.ok) throw new Error("Failed to fetch generated video");
      
      const blob = await videoRes.blob();
      setVideoUrl(URL.createObjectURL(blob));

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Video generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Feature: Nano Banana Powered App (Image Editing)
  const handleEditImage = async () => {
    if (!image || !prompt) {
       setError("Image and prompt required for editing.");
       return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      
      // Using gemini-2.5-flash-image for editing
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            {
              text: prompt
            }
          ]
        }
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const url = `data:image/png;base64,${part.inlineData.data}`;
            setImageUrl(url);
            foundImage = true;
            break;
          }
        }
      }
      if (!foundImage) throw new Error("No edited image generated.");

    } catch (err: any) {
       console.error(err);
       setError(err.message || "Image edit failed");
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateImage = async () => {
    if (!prompt) {
      setError("Prompt is required for image generation.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await checkApiKey();
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: { imageSize: imageSize }
        }
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const url = `data:image/png;base64,${part.inlineData.data}`;
            setImageUrl(url);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) throw new Error("No image generated.");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Image gen failed");
    } finally {
      setIsLoading(false);
    }
  };

  const executeAction = () => {
      if (mode === 'video') handleGenerateVideo();
      else if (mode === 'edit') handleEditImage();
      else handleGenerateImage();
  }

  return (
    <div className="w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI Lab
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{t.veo.title}</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">{t.veo.subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#0b1121] border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
          
          {/* Tabs */}
          <div className="flex gap-6 mb-8 border-b border-slate-800 pb-4 overflow-x-auto">
             <button 
                onClick={() => { setMode('video'); setError(null); }}
                className={`text-sm font-bold uppercase tracking-wide pb-4 -mb-4 border-b-2 transition-all whitespace-nowrap ${mode === 'video' ? 'text-emerald-400 border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
             >
                {t.veo.modeVideo} (Veo)
             </button>
             <button 
                onClick={() => { setMode('edit'); setError(null); }}
                className={`text-sm font-bold uppercase tracking-wide pb-4 -mb-4 border-b-2 transition-all whitespace-nowrap ${mode === 'edit' ? 'text-emerald-400 border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
             >
                Editar (Nano)
             </button>
             <button 
                onClick={() => { setMode('image'); setError(null); }}
                className={`text-sm font-bold uppercase tracking-wide pb-4 -mb-4 border-b-2 transition-all whitespace-nowrap ${mode === 'image' ? 'text-emerald-400 border-emerald-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
             >
                {t.veo.modeImage}
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Input Side */}
            <div className="space-y-6">
              
              {/* Upload Area for Video & Edit Modes */}
              {(mode === 'video' || mode === 'edit') && (
                <>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group
                      ${image ? 'border-emerald-500/50 bg-slate-900' : 'border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/50'}
                    `}
                  >
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <svg className="w-10 h-10 text-slate-500 mb-3 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-slate-400 font-medium">{t.veo.upload}</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                  
                  {mode === 'video' && (
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.veo.aspectRatio}</label>
                        <div className="flex gap-2">
                            <button onClick={() => setAspectRatio('16:9')} className={`flex-1 py-2 text-sm rounded-lg border transition-all ${aspectRatio === '16:9' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}>16:9</button>
                            <button onClick={() => setAspectRatio('9:16')} className={`flex-1 py-2 text-sm rounded-lg border transition-all ${aspectRatio === '9:16' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}>9:16</button>
                        </div>
                    </div>
                  )}
                </>
              )}

              {/* Image Size Config */}
              {mode === 'image' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.veo.imageSize}</label>
                  <div className="flex gap-2">
                      {(['1K', '2K', '4K'] as const).map(size => (
                        <button 
                          key={size}
                          onClick={() => setImageSize(size)} 
                          className={`flex-1 py-2 text-sm rounded-lg border transition-all ${imageSize === size ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                        >
                          {size}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Prompt Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {mode === 'edit' ? "Instrucción de Edición" : t.veo.promptLabel}
                  </label>
                  <button onClick={() => setPrompt(SAMPLE_PROMPT)} className="text-[10px] text-emerald-500 hover:text-emerald-400 font-bold uppercase tracking-wide flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    {t.veo.magicPrompt}
                  </button>
                </div>
                <textarea 
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={mode === 'edit' ? "Ej: Agrega un filtro retro..." : t.veo.promptPlaceholder}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-slate-600 resize-none"
                />
              </div>

              {/* Action Button */}
              <button 
                onClick={executeAction}
                disabled={isLoading || ((mode === 'video' || mode === 'edit') && !image) || !prompt}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                  ${isLoading || ((mode === 'video' || mode === 'edit') && !image) || !prompt
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'}
                `}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {mode === 'video' ? "Animar Video" : mode === 'edit' ? "Editar Imagen" : "Generar Imagen"}
                  </>
                )}
              </button>
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Output Side */}
            <div className="relative rounded-2xl bg-black/50 border border-slate-800 overflow-hidden flex items-center justify-center min-h-[300px]">
              {mode === 'video' ? (
                videoUrl ? (
                  <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                ) : (
                  <Placeholder isLoading={isLoading} />
                )
              ) : (
                imageUrl ? (
                  <img src={imageUrl} alt="Generated" className="w-full h-full object-contain" />
                ) : (
                   <Placeholder isLoading={isLoading} />
                )
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

const Placeholder = ({ isLoading }: { isLoading: boolean }) => (
    <div className="text-center text-slate-600 p-8">
        {isLoading ? (
            <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
            <p className="animate-pulse">Renderizando Media...</p>
            </div>
        ) : (
            <>
            <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <p>El contenido generado aparecerá aquí.</p>
            </>
        )}
    </div>
);
