"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

const API_URL = "http://localhost:5140/test/generateVideo";

interface FormData {
  name: string;
  text: string;
  pose: "seating" | "standing";
  ratio: "16:9" | "9:16";
}

export default function Home() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const blob = await response.blob();
      const videoObjectUrl = URL.createObjectURL(blob);
      setVideoUrl(videoObjectUrl);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left section - Form */}
      <div className="w-1/2 flex items-center justify-center bg-black p-6">
        <div className="p-6 w-full max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-4"> <label className="text-sm font-medium text-white w-1/3">Who do you want to reincarnate?</label> <input 
                type="text" 
                {...register("name", { required: "Name is required" })} 
                className="mt-1 p-2 w-full border border-orange-500 bg-orange-500 text-white"
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="flex items-center space-x-4"> <label className="text-sm font-medium text-white w-1/3">What do you want he/she to say?</label> <input 
                type="text" 
                {...register("text", { required: "Text is required" })} 
                className="mt-1 p-2 w-full border border-orange-500 bg-orange-500 text-white"
                disabled={loading}
              />
              {errors.text && <p className="text-red-500 text-sm">{errors.text.message}</p>}
            </div>
            <div className="flex items-center space-x-4"> <label className="text-sm font-medium text-white w-1/3">Choose the pose</label> 
              <div className="flex space-x-4">
                <label className={`radio-button ${watch('pose') === 'seating' ? 'selected' : ''}`}>
                  <input type="radio" value="seating" {...register("pose", { required: "Pose is required" })} className="hidden" disabled={loading} />
                  Seating
                </label>
                <label className={`radio-button ${watch('pose') === 'standing' ? 'selected' : ''}`}>
                  <input type="radio" value="standing" {...register("pose", { required: "Pose is required" })} className="hidden" disabled={loading} />
                  Standing
                </label>
              </div>
              {errors.pose && <p className="text-red-500 text-sm">{errors.pose.message}</p>}
            </div>
            <div className="flex items-center space-x-4"> <label className="text-sm font-medium text-white w-1/3">Choose the format</label> 
              <div className="flex space-x-4">
                <label className={`radio-button ${watch('ratio') === '16:9' ? 'selected' : ''}`}>
                  <input type="radio" value="16:9" {...register("ratio", { required: "Ratio is required" })} className="hidden" disabled={loading} />
                  16:9
                </label>
                <label className={`radio-button ${watch('ratio') === '9:16' ? 'selected' : ''}`}>
                  <input type="radio" value="9:16" {...register("ratio", { required: "Ratio is required" })} className="hidden" disabled={loading} />
                  9:16
                </label>
              </div>
              {errors.ratio && <p className="text-red-500 text-sm">{errors.ratio.message}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "G E N E R A T I N G" : "G E N E R A T E"}
            </button>
          </form>
        </div>
      </div>
      
      {/* Separator */}
      <div className="flex flex-col items-center w-0.5 h-1/2 bg-gray-300 self-center">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 mb-4" />
        <div className="h-full w-0.5 bg-gray-300"></div>
      </div>
      
      {/* Right section - Video display */}
      <div className="w-1/2 flex items-center justify-center bg-black">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : videoUrl ? (
          <video controls className="w-3/4 max-w-lg rounded-lg shadow-lg">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-gray-500">No video available</p>
        )}
      </div>
    </div>
  );
}


