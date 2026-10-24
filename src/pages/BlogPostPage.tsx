import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBooking } from '../context/BookingContext';
import { allBlogPosts } from '../data/clinicData';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();
  const { openBooking } = useBooking();
  const navigate = useNavigate();

  const post = allBlogPosts.find((p) => p.slug === slug) || allBlogPosts[0];

  return (
    <main className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      <button
        onClick={() => navigate('/blog')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('Back to all articles', 'ወደ ጽሁፎች ተመለስ')}</span>
      </button>

      <article className="space-y-8">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f0edfe] text-[#8e7cf0]">
            {post.category}
          </span>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 leading-tight">
            {language === 'am' && post.titleAm ? post.titleAm : post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 mt-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold text-slate-800">{post.author.name} ({post.author.role})</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
            <span>•</span>
            <span>{post.publishedAt}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="prose max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
          {language === 'am' && post.contentAm ? post.contentAm : post.content}
        </div>

        {/* Post CTA (Law 4: Every page ends with a CTA) */}
        <div className="mt-12 p-8 rounded-3xl bg-[#e3f4f9] border border-cyan-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {t('Have a question about your teeth?', 'ስለ ጥርስዎ ጥያቄ አለዎት?')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t('Book a comprehensive checkup with our clinic specialists today in Bole.', 'በክሊኒካችን ከስፔሻሊስት ጋር የፈተሻ ቀጠሮ ይያዙ።')}
            </p>
          </div>

          <button
            onClick={() => openBooking()}
            className="shrink-0 px-6 py-3 rounded-full bg-[#2ba8c9] hover:bg-[#1c88a6] text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            {t('Book a visit', 'ቀጠሮ ይያዙ')}
          </button>
        </div>
      </article>
    </main>
  );
};

export default BlogPostPage;
