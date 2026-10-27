import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import Reveal from '../components/motion/Reveal';
import { useLanguage } from '../context/LanguageContext';
import { useBlogPosts } from '../context/DataContext';

export const BlogPage: React.FC = () => {
  const allBlogPosts = useBlogPosts();
  const { language, t } = useLanguage();

  return (
    <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="max-w-3xl mb-12">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#f0edfe] text-[#8e7cf0] mb-3">
          {t('Dental Health Education', 'የጥርስ ጤና ትምህርት')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('Articles & Clinical Guides', 'ጽሁፎች እና መመሪያዎች')}
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          {t(
            'Explore clinical dental advice written by Dentora doctors. Learn about enamel protection, pediatric habits, and myth-free oral hygiene.',
            'በሀኪሞቻችን የተዘጋጁ ጠቃሚ የጥርስ ጤና ትምህርቶችን ያንብቡ።'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allBlogPosts.map((post, idx) => (
          <Reveal key={post.id} variant="up" delay={idx * 100}>
            <article className="h-full bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="font-bold text-lg text-slate-900 hover:text-[#8e7cf0] transition-colors mb-2 leading-snug">
                  <Link to={`/blog/${post.slug}`}>
                    {language === 'am' && post.titleAm ? post.titleAm : post.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {language === 'am' && post.excerptAm ? post.excerptAm : post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-800">{post.author.name}</span>
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="text-xs font-bold text-[#8e7cf0] hover:underline flex items-center gap-1"
                >
                  <span>{t('Read', 'አንብብ')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
};

export default BlogPage;
