'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  X, 
  ChevronDown, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  HelpCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Factory, 
  ShieldCheck, 
  Truck, 
  Palette, 
  Maximize2, 
  Minimize2,
  Share2
} from 'lucide-react';
import { FAQItem, FAQ_CATEGORIES, STATIC_FAQS, mergeWithDynamicFaqs } from '@/data/faqsData';

interface FaqsClientProps {
  /** Optional dynamic FAQs if ever loaded from an API/CMS in the future */
  dynamicFaqs?: FAQItem[];
}

export default function FaqsClient({ dynamicFaqs }: FaqsClientProps) {
  // Use static FAQs by default, merged with dynamic FAQs if supplied
  const allFaqs = useMemo(() => mergeWithDynamicFaqs(dynamicFaqs), [dynamicFaqs]);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    // Open the first 3 by default
    return new Set(allFaqs.slice(0, 3).map(f => f.id));
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const phoneDisplay = "+91 9895363788";
  const phoneTel = "tel:+919895363788";
  const whatsappBaseUrl = "https://wa.me/919895363788";

  // Filter FAQs based on active category & search query
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allFaqs.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      if (!matchCat) return false;

      if (!q) return true;
      const matchQ = item.question.toLowerCase().includes(q);
      const matchA = item.answer.toLowerCase().includes(q);
      const matchK = item.keywords.some(k => k.toLowerCase().includes(q));
      return matchQ || matchA || matchK;
    });
  }, [allFaqs, activeCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIds(new Set(filteredFaqs.map(f => f.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  const copyToClipboard = async (item: FAQItem) => {
    try {
      const text = `Q: ${item.question}\n\nA: ${item.answer}\n\nSource: Despearl Furniture Factory (+91 9895363788)`;
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback silent
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          SEARCH BAR & CONTROL ROW
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-3xs space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. Pinterest sofa, Teak cot, Delivery to Kochi, NRI orders, Pricing)..."
            className="w-full pl-12 pr-10 py-3.5 bg-gray-50 hover:bg-gray-50/80 focus:bg-white text-gray-900 border border-gray-300 focus:border-amber-600 rounded-xl text-sm md:text-base outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills (Nykaa/Myntra Clean Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs md:text-sm">
          {FAQ_CATEGORIES.map((cat) => {
            const count = cat.id === 'all' 
              ? allFaqs.length 
              : allFaqs.filter(f => f.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700'
                }`}
              >
                <span>{cat.shortName}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Metadata & Expand/Collapse Toggle */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100">
          <div>
            Showing <strong className="text-gray-900">{filteredFaqs.length}</strong> of {allFaqs.length} verified answers
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium transition"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand All</span>
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={collapseAll}
              className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium transition"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Collapse All</span>
            </button>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          FAQ ACCORDIONS LIST
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="space-y-3.5">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openIds.has(faq.id);
            const isCopied = copiedId === faq.id;
            const itemWhatsappUrl = `${whatsappBaseUrl}?text=Hello%20Despearl!%20I%20have%20a%20question%20about:%20${encodeURIComponent(faq.question)}`;

            return (
              <div
                key={faq.id}
                id={faq.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-3xs ${
                  isOpen ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Accordion Header / Question Trigger */}
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-5 py-4.5 md:py-5 flex items-start justify-between gap-4 text-left cursor-pointer group select-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1.5 flex-1 pr-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {faq.aiHighlight && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-amber-700" />
                          <span>AI Top Result</span>
                        </span>
                      )}
                      <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                        {FAQ_CATEGORIES.find(c => c.id === faq.category)?.shortName || 'General'}
                      </span>
                    </div>

                    <h3 className="text-gray-900 font-bold text-base md:text-lg font-outfit tracking-tight leading-snug group-hover:text-amber-800 transition-colors">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-amber-50 text-amber-800 border-amber-300' : 'bg-gray-50 text-gray-500 group-hover:bg-gray-100'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Answer Content */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-[#FCFCFD] space-y-4 animate-in fade-in-50 duration-200">
                    <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-2">
                      <p>{faq.answer}</p>
                    </div>

                    {/* Quick Keywords Tags */}
                    {faq.keywords && faq.keywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mr-1">
                          Keywords:
                        </span>
                        {faq.keywords.map((kw, idx) => (
                          <Link
                            key={idx}
                            href={`/search?q=${encodeURIComponent(kw)}`}
                            className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs transition"
                          >
                            {kw}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons for this specific question */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200/80 text-xs">
                      <div className="flex items-center gap-2">
                        <a
                          href={itemWhatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ask on WhatsApp</span>
                        </a>

                        <a
                          href={phoneTel}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 font-semibold transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-700" />
                          <span>Call Factory</span>
                        </a>
                      </div>

                      <button
                        onClick={() => copyToClipboard(faq)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 font-medium transition shadow-3xs"
                        title="Copy answer to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                            <span>Copy Answer</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty Search State */
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4 shadow-3xs">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-gray-900 font-bold text-lg font-outfit">
                No matching answers found for &ldquo;{searchQuery}&rdquo;
              </h4>
              <p className="text-gray-600 text-xs md:text-sm">
                Have a unique design, specific room size, or custom question? Our master craftsmen answer directly on WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition"
              >
                Clear Search &amp; Show All
              </button>
              <a
                href={`${whatsappBaseUrl}?text=Hello%20Despearl!%20I%20have%20a%20custom%20question:%20${encodeURIComponent(searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask on WhatsApp: {phoneDisplay}</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          NEED MORE HELP? DIRECT FACTORY HELPLINE CARD
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF6EE] to-[#FFF9F0] border border-[#E8DEC8] p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-bold uppercase tracking-wider">
              <Factory className="w-3.5 h-3.5 text-amber-700" />
              <span>Direct Factory Consultation</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black font-outfit text-gray-900 tracking-tight">
              Have a Specific Pinterest Design or Custom Requirement?
            </h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
              Connect directly with our chief furniture master craftsmen. Send your room plan, Pinterest screenshot, or wood specifications for an instant free 3D estimate with zero middleman markup.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`${whatsappBaseUrl}?text=Hello%20Despearl!%20I%20have%20a%20Pinterest%20or%20custom%20furniture%20question.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-xs transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Us Now</span>
            </a>
            <a
              href={phoneTel}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-bold text-xs md:text-sm shadow-3xs transition active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              <span>Call: {phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
