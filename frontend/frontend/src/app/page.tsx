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
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Who do you want to reincarnate?</label>
              <input 
                type="text" 
                {...register("name", { required: "Name is required" })} 
                className="mt-1 p-2 w-full border rounded-md"
                disabled={loading}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">What do you want he/she to say?</label>
              <input 
                type="text" 
                {...register("text", { required: "Text is required" })} 
                className="mt-1 p-2 w-full border rounded-md"
                disabled={loading}
              />
              {errors.text && <p className="text-red-500 text-sm">{errors.text.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Choose the pose</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" value="seating" {...register("pose", { required: "Pose is required" })} className="mr-2" disabled={loading} />
                  Seating
                </label>
                <label className="flex items-center">
                  <input type="radio" value="standing" {...register("pose", { required: "Pose is required" })} className="mr-2" disabled={loading} />
                  Standing
                </label>
              </div>
              {errors.pose && <p className="text-red-500 text-sm">{errors.pose.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Choose the format</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input type="radio" value="16:9" {...register("ratio", { required: "Ratio is required" })} className="mr-2" disabled={loading} />
                  16:9
                </label>
                <label className="flex items-center">
                  <input type="radio" value="9:16" {...register("ratio", { required: "Ratio is required" })} className="mr-2" disabled={loading} />
                  9:16
                </label>
              </div>
              {errors.ratio && <p className="text-red-500 text-sm">{errors.ratio.message}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </form>
        </div>
      </div>
      
      {/* Separator */}
      <div className="w-0.5 bg-gray-300 h-3/4"></div>
      
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

