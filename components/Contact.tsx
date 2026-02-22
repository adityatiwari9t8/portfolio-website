import React, { useState } from 'react';
import { Instagram, Linkedin, Github, Code2, ChevronDown } from 'lucide-react';

interface ContactProps {
  isModal?: boolean;
}

const Contact: React.FC<ContactProps> = ({ isModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: '',
    message: ''
  });

  const socialLinks = [
    { icon: Instagram, url: 'https://www.instagram.com/adityatiwari_98' },
    { icon: Linkedin, url: 'https://www.linkedin.com/in/adityatiwari9t8' },
    { icon: Github, url: 'https://github.com/adityatiwari9t8' },
    { icon: Code2, url: 'https://leetcode.com/Aditya_Tiwari_98/' },
  ];

  const interests = [
    'Project Collaboration',
    'Technology Discussion',
    'Product / Systems Ideas',
    'Research or Learning Opportunity',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
  };

  return (
    <section className={`space-y-20 ${isModal ? 'py-4' : 'py-12'}`}>

      {/* ================= HEADER ================= */}
      <div className="text-center space-y-6">

        <h2 className={`
          font-extrabold
          text-[#1e293b] dark:text-white
          ${isModal ? 'text-4xl' : 'text-5xl lg:text-7xl'}
        `}>
          Contact
        </h2>

        <p className="
          text-base sm:text-xl text-slate-500 dark:text-slate-400
          leading-relaxed font-medium
          max-w-2xl mx-auto
        ">
          I’m always open to thoughtful conversations around technology,
          systems, learning, and building meaningful projects. If you’d like
          to collaborate or exchange ideas — reach out below or email me at{' '}
          <span className="text-[#1e293b] dark:text-white font-bold">
            adityatiwari98@gmail.com
          </span>.
        </p>

        {/* SOCIAL LINKS */}
        <div className="flex justify-center gap-5 pt-4">
          {socialLinks.map((social, i) => (
            <a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                p-3 rounded-xl

                bg-white
                dark:bg-white/5

                border border-slate-200
                dark:border-white/10

                text-slate-400
                hover:text-[#3d4977]
                dark:hover:text-white

                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="
        max-w-5xl mx-auto
        rounded-[2.5rem]
        p-6 sm:p-8 lg:p-16
        space-y-10 lg:space-y-12

        border border-slate-200 dark:border-white/10

        bg-white
        dark:bg-gradient-to-b
        dark:from-slate-900
        dark:to-slate-950

        shadow-sm
      ">

        <h3 className="
          text-3xl sm:text-4xl lg:text-5xl
          font-extrabold text-center
          text-[#1e293b] dark:text-white
        ">
          Get In Touch
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

          {/* NAME + EMAIL */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <input
              type="text"
              placeholder="Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="
                w-full px-4 sm:px-6 py-4 rounded-xl
                bg-slate-50 dark:bg-white/5
                border border-slate-200 dark:border-white/10
                focus:outline-none focus:ring-2
                focus:ring-[#3d4977]/20
                text-base sm:text-lg dark:text-white
              "
            />

            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="
                w-full px-4 sm:px-6 py-4 rounded-xl
                bg-slate-50 dark:bg-white/5
                border border-slate-200 dark:border-white/10
                focus:outline-none focus:ring-2
                focus:ring-[#3d4977]/20
                text-base sm:text-lg dark:text-white
              "
            />
          </div>

          {/* SELECT */}
          <div className="relative">
            <select
              required
              value={formData.interest}
              onChange={(e) =>
                setFormData({ ...formData, interest: e.target.value })
              }
              className="
                w-full px-4 sm:px-6 py-4 rounded-xl
                appearance-none truncate pr-12
                bg-slate-50 dark:bg-white/5
                border border-slate-200 dark:border-white/10
                text-base sm:text-lg text-slate-700 dark:text-slate-300
                focus:outline-none focus:ring-2
                focus:ring-[#3d4977]/20
              "
            >
              {/* Consider changing this text to "Select an interest..." if it still feels too long */}
              <option value="" disabled>
                Select what you're interested in...
              </option>
              {interests.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <ChevronDown className="
              absolute right-4 sm:right-6 top-1/2 -translate-y-1/2
              text-slate-400 pointer-events-none shrink-0
            " />
          </div>

          {/* MESSAGE */}
          <textarea
            rows={6}
            placeholder="Enter your message"
            required
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="
              w-full px-4 sm:px-6 py-5 rounded-xl
              resize-none
              bg-slate-50 dark:bg-white/5
              border border-slate-200 dark:border-white/10
              focus:outline-none focus:ring-2
              focus:ring-[#3d4977]/20
              text-base sm:text-lg dark:text-white
            "
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full sm:w-auto
              px-10 py-4 rounded-xl
              font-semibold text-lg
              text-white
              bg-[#3d4977]
              hover:bg-[#2d365a]
              transition-all
              hover:-translate-y-1
              active:scale-95
              shadow-lg
            "
          >
            Send Message
          </button>

        </form>
      </div>

    </section>
  );
};

export default Contact;