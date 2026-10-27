import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import SectionOpener from '../ui/SectionOpener';
import Reveal from '../motion/Reveal';
import { useLanguage } from '../../context/LanguageContext';
import { useBlogPosts } from '../../context/DataContext';
import { latestBlogPost as fallbackLatest } from '../../data/clinicData';

export const LatestBlogSection: React.FC = () => {
  const { language, t } = useLanguage();
  // newest published post from DB; empty list → bundled fallback post
  const latestBlogPost = useBlogPosts()[0] ?? fallbackLatest;

  return (
    <SectionOpener
      id="blog"
      tone="blog"
      from="#fdebee"
      label={t('From Our Blog', 'ከብሎጋችን')}
      title={t('We Care & We Teach:', 'እውቀት እና እንክብካቤ፡')}
      titleSoft={t('Practical Oral Health Advice for Everyday Smiles.', 'ለዕለታዊ የጥርስ ጤንነት የሚረዱ ተግባራዊ ምክሮች።')}
      promise={t('Our specialists regularly publish straightforward, myth-free dental advice to help you keep your real teeth strong for life.', 'ጥርስዎን ለረጅም ዓመታት ጤናማ አድርገው እንዲይዙ የሚያግዙ ጠቃሚ ትምህርቶች።')}
    >
      <div className="max-w-4xl mx-auto">
        <Reveal variant="up">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-md hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-6 items-center">
            {/* Left Column: Post Cover & Category */}
            <div className="w-full md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
              <img
                src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80"
                alt={latestBlogPost.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-purple-950 backdrop-blur-xs shadow-sm">
                {latestBlogPost.category}
              </span>
            </div>

            {/* Right Column: Title, Excerpt, Author & Action */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{latestBlogPost.readTime}</span>
                  </span>
                  <span>•</span>
                  <span>{latestBlogPost.publishedAt}</span>
                </div>

                <h3 className="font-bold text-xl sm:text-2xl text-slate-900 hover:text-[#8e7cf0] transition-colors leading-snug">
                  <Link to={`/blog/${latestBlogPost.slug}`}>
                    {language === 'am' && latestBlogPost.titleAm ? latestBlogPost.titleAm : latestBlogPost.title}
                  </Link>
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'am' && latestBlogPost.excerptAm ? latestBlogPost.excerptAm : latestBlogPost.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={latestBlogPost.author.avatar}
                    alt={latestBlogPost.author.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="text-xs">
                    <strong className="text-slate-900 block font-semibold">{latestBlogPost.author.name}</strong>
                    <span className="text-slate-500">{latestBlogPost.author.role}</span>
                  </div>
                </div>

                <Link
                  to={`/blog/${latestBlogPost.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-slate-100 hover:bg-[#8e7cf0] text-slate-900 hover:text-white transition-colors"
                >
                  <span>{t('Read article', 'ሙሉውን ያንብቡ')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* View all articles link */}
        <div className="text-center mt-6">
          <Link
            to="/blog"
            className="text-xs sm:text-sm font-semibold text-[#8e7cf0] hover:underline"
          >
            {t('Browse all dental articles & patient guides →', 'ሁሉንም የጥርስ ጤና ጽሁፎች ይመልከቱ →')}
          </Link>
        </div>
      </div>
    </SectionOpener>
  );
};

export default LatestBlogSection;
