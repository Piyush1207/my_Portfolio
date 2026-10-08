"use client";

import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setStatus("");

    try {
      // NOTE: This is a front-end-only placeholder.
      // TODO: Replace with a real /api/contact endpoint with Zod schema validation
      // and rate-limiting before deploying to production.
      await new Promise((r) => setTimeout(r, 500));
      setStatus("Message sent successfully! (Front-end only)");
      form.reset();
    } catch {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-full py-16 sm:py-20 md:py-24 flex flex-col items-center gap-10 sm:gap-12">
      <div className="bg-white rounded-3xl sm:rounded-[40px] px-6 sm:px-10 md:px-16 my-8 sm:my-12 mx-4 sm:mx-6 md:mx-auto shadow-lg border border-black/5 max-w-full">
        <div className="text-center max-w-2xl px-4 sm:px-6 py-6 sm:py-8">
          <h2 className="text-[42px] sm:text-[56px] md:text-[70px] font-bold tracking-tighter leading-none mb-4 sm:mb-6">
            Let&apos;s work together.
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Fill out the form below or drop me an email at piyushatalkar12@gmail.com
          </p>
        </div>

        <form onSubmit={handleSubmit} suppressHydrationWarning className="px-4 sm:px-6 pb-6 sm:pb-8 flex flex-col gap-4 sm:gap-6 max-w-xl mx-auto">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              type="text"
              id="name"
              required
              suppressHydrationWarning
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              required
              suppressHydrationWarning
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="project" className="text-sm font-medium">Your Project</label>
            <textarea
              id="project"
              required
              rows={4}
              suppressHydrationWarning
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 transition-all resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-foreground text-white py-3.5 sm:py-4 rounded-xl font-medium hover:bg-black hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isSubmitting ? "Sending…" : "Submit"}
          </button>

          {status && (
            <p className={`text-center text-sm sm:text-base font-medium ${status.includes("successfully") ? "text-green-600" : "text-red-500"}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}