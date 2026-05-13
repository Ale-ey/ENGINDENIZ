"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    adresse: "",
    plzOrt: "",
    email: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _subject: "New Registration / Enquiry",
          Name: formData.name,
          Adresse: formData.adresse,
          "PLZ / Ort": formData.plzOrt,
          "E-Mail": formData.email,
        })
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", adresse: "", plzOrt: "", email: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3 font-sans w-full mb-8">
      <input 
        type="text" 
        placeholder="Name" 
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-4 py-3 bg-white rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-[14px]"
        required
      />
      <input 
        type="text" 
        placeholder="Adresse" 
        value={formData.adresse}
        onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
        className="w-full px-4 py-3 bg-white rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-[14px]"
        required
      />
      <input 
        type="text" 
        placeholder="PLZ / Ort" 
        value={formData.plzOrt}
        onChange={(e) => setFormData({ ...formData, plzOrt: e.target.value })}
        className="w-full px-4 py-3 bg-white rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-[14px]"
        required
      />
      <input 
        type="email" 
        placeholder="E-Mail" 
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full px-4 py-3 bg-white rounded-none text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all text-[14px]"
        required
      />
      
      <div className="pt-4 flex flex-col space-y-3">
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="bg-black text-white px-8 py-3 rounded-full font-sans font-medium hover:bg-[#d71921] transition-colors text-[14px] inline-flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Sending..." : "Register"}
        </button>
        
        {status === "success" && (
          <p className="text-green-600 font-sans text-sm text-center">Registration sent successfully!</p>
        )}
        {status === "error" && (
          <p className="text-red-500 font-sans text-sm text-center">Something went wrong. Please try again.</p>
        )}
      </div>
    </form>
  );
}
