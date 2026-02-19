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
    { icon: Instagram, url: 'https://www.instagram.com/adityatiwari_98?igsh=MWprcHhuM2NxbWIycA%3D%3D&utm_source=qr' },
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
    <div className={`space-y-20 ${isModal ? 'py-4' : 'py-12'}`}>
      <div className="text-center space-y-6">
        <h2 className={`font-extrabold text-[#1e293b] dark:text-white ${isModal ? 'text-4xl' : 'text-5xl lg:text-7xl'}`}>
          Contact
        </h2>

        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            I’m always open to thoughtful conversations around technology,
            systems, learning, and building meaningful projects. If you’d like
            to collaborate, exchange ideas, or simply connect — feel free to
            reach out using the form below or email me at{' '}
            <span className="text-[#1e293b] dark:text-white font-bold">
              adityatiwari98@gmail.com
            </span>.
          </p>
        </div>

        <div className="flex justify-center space-x-6 pt-4">
          {socialLinks.map((social, i) => (
            <a 
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-slate-700 text-slate-400 rounded-xl hover:text-[#3d4977] dark:hover:text-white hover:shadow-lg transition-all border border-slate-100 dark:border-slate-600"
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-16 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 max-w-5xl mx-auto space-y-12">
        <h3 className="text-4xl lg:text-5xl font-extrabold text-[#1e293b] dark:text-white text-center">
          Get In Touch
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <input
              type="text"
              placeholder="Name"
              required
              className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3d4977]/20 focus:border-[#3d4977] transition-all text-lg placeholder:text-slate-400 dark:text-white"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3d4977]/20 focus:border-[#3d4977] transition-all text-lg placeholder:text-slate-400 dark:text-white"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <select
              required
              className="w-full px-8 py-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3d4977]/20 focus:border-[#3d4977] transition-all text-lg text-slate-700 dark:text-slate-300"
              value={formData.interest}
              onChange={(e) => setFormData({...formData, interest: e.target.value})}
            >
              <option value="" disabled>Select what you're interested in...</option>
              {interests.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <textarea
            placeholder="Enter your message"
            required
            rows={6}
            className="w-full px-8 py-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3d4977]/20 focus:border-[#3d4977] transition-all text-lg placeholder:text-slate-400 resize-none dark:text-white"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />

          <button
            type="submit"
            className="px-12 py-5 bg-[#5d678d] hover:bg-[#3d4977] text-white rounded-xl font-bold text-xl shadow-lg transition-all hover:-translate-y-1 active:scale-95"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
