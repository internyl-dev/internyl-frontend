"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Search, BookOpen, Clock, Users, DollarSign, MapPin, GraduationCap, Mail, Shield, Sparkles, HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ElementType;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    id: "getting-started-1",
    question: "How do I start looking for internships on your platform?",
    answer: "Simply use our search bar to find internships by keyword, or browse through our filter options including subject, location, cost, and eligibility. You can also sort results by deadline, cost, or relevance to find the perfect match for your interests.",
    category: "Getting Started",
    icon: BookOpen
  },
  {
    id: "getting-started-2", 
    question: "Do I need to create an account to browse internships?",
    answer: "No! You can browse and search all internships without creating an account. However, creating a free account allows you to bookmark your favorite opportunities and track application deadlines more easily.",
    category: "Getting Started",
    icon: Users
  },
  {
    id: "getting-started-3",
    question: "How often are new internships added?",
    answer: "We continuously update our database with new opportunities. New internships are typically added weekly, with major updates happening at the start of each application season (fall for summer programs).",
    category: "Getting Started",
    icon: Clock
  },

  // Eligibility & Applications
  {
    id: "eligibility-1",
    question: "I&apos;m a freshman - are there internships available for me?",
    answer: "Absolutely! While many competitive programs target juniors and seniors, we have numerous opportunities specifically for freshmen and sophomores. Use our &apos;Eligibility&apos; filter to find programs that accept your grade level.",
    category: "Eligibility & Applications",
    icon: GraduationCap
  },
  {
    id: "eligibility-2",
    question: "What&apos;s the difference between &apos;Rising Junior&apos; and &apos;Junior&apos;?",
    answer: "&apos;Rising Junior&apos; means you&apos;ll be a junior in the fall (currently a sophomore), while &apos;Junior&apos; means you&apos;re currently a junior. Most summer programs use &apos;Rising&apos; terminology since they occur between academic years.",
    category: "Eligibility & Applications",
    icon: GraduationCap
  },
  {
    id: "eligibility-3",
    question: "Can international students apply to these programs?",
    answer: "Eligibility varies by program. Some are open to international students, while others may be restricted to US citizens or residents. Check the specific eligibility requirements for each internship you're interested in.",
    category: "Eligibility & Applications",
    icon: Users
  },
  {
    id: "eligibility-4",
    question: "How do I apply to internships listed on your site?",
    answer: "We provide information about internships, but applications are submitted directly to the host organizations. Each listing includes application links and contact information to help you apply directly to the program.",
    category: "Eligibility & Applications",
    icon: Mail
  },

  // Costs & Financial Aid
  {
    id: "costs-1",
    question: "Are there free internship opportunities?",
    answer: "Yes! Use our &apos;Cost&apos; filter and select &apos;Free&apos; to find programs with no participation fees. These include many research opportunities, government programs, and some corporate internships.",
    category: "Costs & Financial Aid",
    icon: DollarSign
  },
  {
    id: "costs-2",
    question: "Why do some internships cost money?",
    answer: "Programs that charge fees typically provide housing, meals, materials, field trips, and intensive mentorship. These are often educational programs that offer college credit or extensive hands-on learning experiences.",
    category: "Costs & Financial Aid",
    icon: DollarSign
  },
  {
    id: "costs-3",
    question: "Do any programs offer financial aid or scholarships?",
    answer: "Many programs offer need-based aid or merit scholarships. Look for mentions of &apos;financial aid available&apos; in program descriptions, and don&apos;t hesitate to contact programs directly about funding opportunities.",
    category: "Costs & Financial Aid",
    icon: DollarSign
  },
  {
    id: "costs-4",
    question: "What does &apos;Stipend&apos; mean?",
    answer: "A stipend means the program pays you for participating! These are typically research or work-based internships where you receive payment for your contribution to the organization.",
    category: "Costs & Financial Aid",
    icon: DollarSign
  },

  // Program Types & Subjects
  {
    id: "programs-1",
    question: "What subjects and fields are available?",
    answer: "We feature internships across many fields including STEM (science, technology, engineering, math), business, medicine, law, arts, social sciences, and more. Use our &apos;Subject&apos; filter to explore specific areas of interest.",
    category: "Program Types & Subjects",
    icon: BookOpen
  },
  {
    id: "programs-2",
    question: "Are there virtual/remote internship options?",
    answer: "Yes! Many programs now offer virtual components or fully remote experiences. Look for location listings that mention &apos;Virtual&apos; or &apos;Remote&apos; when browsing opportunities.",
    category: "Program Types & Subjects",
    icon: MapPin
  },
  {
    id: "programs-3",
    question: "How long do most internships last?",
    answer: "Program durations vary widely. Use our &apos;Duration&apos; filter to find programs that fit your schedule - from 1-week intensives to full summer programs lasting 8+ weeks. Most fall between 2-6 weeks.",
    category: "Program Types & Subjects",
    icon: Clock
  },

  // Deadlines & Timing
  {
    id: "timing-1",
    question: "When should I start looking for summer internships?",
    answer: "Start early! Many competitive programs have deadlines between November and February for summer programs. We recommend beginning your search in early fall (September-October) of your junior year.",
    category: "Deadlines & Timing",
    icon: Clock
  },
  {
    id: "timing-2",
    question: "What does &apos;Rolling Admission&apos; mean?",
    answer: "Rolling admission means applications are reviewed as they&apos;re received, rather than after a single deadline. Apply early for the best chances, as spots may fill before the final deadline.",
    category: "Deadlines & Timing",
    icon: Clock
  },
  {
    id: "timing-3",
    question: "I missed a deadline - are there still opportunities available?",
    answer: "Don&apos;t give up! Use our &apos;Due in&apos; filter to find programs with later deadlines. Some programs have rolling admissions or accept late applications if space is available.",
    category: "Deadlines & Timing",
    icon: Clock
  },

  // Technical & Account Issues
  {
    id: "technical-1",
    question: "How do I bookmark internships?",
    answer: "Create a free account, then click the bookmark icon on any internship card. Your saved internships will be accessible anytime you log in, and you can filter to view only bookmarked opportunities.",
    category: "Technical & Account Issues",
    icon: Shield
  },
  {
    id: "technical-2",
    question: "Why isn't a program showing up in my search results?",
    answer: "Check your active filters - they might be too restrictive. Try clearing filters or adjusting your search terms. Some programs may also have limited eligibility that doesn&apos;t match your current filter settings.",
    category: "Technical & Account Issues",
    icon: Search
  },
  {
    id: "technical-3",
    question: "How do I contact you about a problem or suggestion?",
    answer: "We&apos;d love to hear from you! Use the contact information provided on our website to reach out with questions, technical issues, or suggestions for improving our platform.",
    category: "Technical & Account Issues",
    icon: Mail
  }
];

const categories = [
  { name: "Getting Started", icon: BookOpen, color: "from-blue-500 to-blue-600" },
  { name: "Eligibility & Applications", icon: GraduationCap, color: "from-green-500 to-green-600" },
  { name: "Costs & Financial Aid", icon: DollarSign, color: "from-yellow-500 to-yellow-600" },
  { name: "Program Types & Subjects", icon: BookOpen, color: "from-purple-500 to-purple-600" },
  { name: "Deadlines & Timing", icon: Clock, color: "from-red-500 to-red-600" },
  { name: "Technical & Account Issues", icon: Shield, color: "from-gray-500 to-gray-600" }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  const fadeInUp = {
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  const staggerDelay = (index: number) => ({
    ...fadeInUp,
    transitionDelay: `${index * 0.1}s`
  });

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 py-16 max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-24" style={fadeInUp}>
          <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
            Get Your Questions Answered
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent animate-gradient bg-300% bg-gradient-to-r">
              Questions
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            Find answers to common questions about finding and applying to high school internships
          </p>
        </div>

        <div className="space-y-20">
          {/* Search Bar */}
          <div style={staggerDelay(0)}>
            <div className="bg-gradient-to-br from-white/60 to-blue-50/40 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-xl">
              <div className="relative">
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                  <Search className="text-white w-6 h-6" />
                </div>
                <input
                  type="text"
                  placeholder="Search for questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-20 pr-8 py-6 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all duration-300 placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div style={staggerDelay(1)}>
            <div className="bg-gradient-to-br from-white/60 to-purple-50/40 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse by Category</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                    !selectedCategory 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white transform scale-105' 
                      : 'bg-white/50 text-gray-700 border border-white/40 hover:bg-white/70 backdrop-blur-sm'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                        selectedCategory === category.name
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white transform scale-105'
                          : 'bg-white/50 text-gray-700 border border-white/40 hover:bg-white/70 backdrop-blur-sm'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory) && (
            <div className="text-center" style={staggerDelay(2)}>
              <div className="bg-gradient-to-br from-white/50 to-gray-50/40 backdrop-blur-sm border border-white/40 rounded-2xl p-4 shadow-lg inline-block">
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold underline mr-4 transition-colors duration-300"
                >
                  Clear all filters
                </button>
                <span className="text-gray-600 text-sm">
                  ({filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          )}

          {/* FAQ Items */}
          <div style={staggerDelay(3)}>
            <div className="space-y-6">
              {filteredFAQs.map((faq) => {
                const Icon = faq.icon;
                const category = categories.find(cat => cat.name === faq.category);
                const isOpen = openItems.has(faq.id);

                return (
                  <div key={faq.id} className="bg-gradient-to-br from-white/60 to-gray-50/40 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-8 py-6 text-left hover:bg-white/30 transition-all duration-300 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`bg-gradient-to-br ${category?.color || 'from-gray-500 to-gray-600'} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                            {faq.question}
                          </h3>
                          <span className="text-sm text-gray-600 font-medium px-3 py-1 bg-white/40 rounded-full">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-6 h-6 text-gray-500 transition-all duration-300 group-hover:text-blue-600 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    {isOpen && (
                      <div className="px-8 pb-6">
                        <div className="pl-18 bg-white/30 backdrop-blur-sm rounded-xl p-6 border border-white/40">
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <div style={staggerDelay(4)}>
              <div className="bg-gradient-to-br from-white/60 to-gray-50/40 backdrop-blur-sm border border-white/40 rounded-3xl p-12 shadow-xl text-center">
                <div className="bg-gradient-to-br from-gray-400 to-gray-500 p-6 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No questions found
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search terms or browse different categories
                </p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Show all questions
                </button>
              </div>
            </div>
          )}

          {/* Still have questions? */}
          <div style={staggerDelay(5)}>
            <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm border border-white/40 rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-3xl w-20 h-20 mx-auto mb-8 flex items-center justify-center shadow-lg">
                  <HelpCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Still have questions?
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                  Can&apos;t find what you&apos;re looking for? We&apos;re here to help you find the perfect internship opportunity.
                </p>
                <button className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Mail className="w-6 h-6" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}