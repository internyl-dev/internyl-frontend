"use client";

import React, { useState } from "react";
import { ChevronDown, Search, BookOpen, Clock, Users, DollarSign, MapPin, GraduationCap, Mail, Shield } from "lucide-react";

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
    question: "I'm a freshman - are there internships available for me?",
    answer: "Absolutely! While many competitive programs target juniors and seniors, we have numerous opportunities specifically for freshmen and sophomores. Use our 'Eligibility' filter to find programs that accept your grade level.",
    category: "Eligibility & Applications",
    icon: GraduationCap
  },
  {
    id: "eligibility-2",
    question: "What's the difference between 'Rising Junior' and 'Junior'?",
    answer: "'Rising Junior' means you'll be a junior in the fall (currently a sophomore), while 'Junior' means you're currently a junior. Most summer programs use 'Rising' terminology since they occur between academic years.",
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
    answer: "Yes! Use our 'Cost' filter and select 'Free' to find programs with no participation fees. These include many research opportunities, government programs, and some corporate internships.",
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
    answer: "Many programs offer need-based aid or merit scholarships. Look for mentions of 'financial aid available' in program descriptions, and don't hesitate to contact programs directly about funding opportunities.",
    category: "Costs & Financial Aid",
    icon: DollarSign
  },
  {
    id: "costs-4",
    question: "What does 'Stipend' mean?",
    answer: "A stipend means the program pays you for participating! These are typically research or work-based internships where you receive payment for your contribution to the organization.",
    category: "Costs & Financial Aid",
    icon: DollarSign
  },

  // Program Types & Subjects
  {
    id: "programs-1",
    question: "What subjects and fields are available?",
    answer: "We feature internships across many fields including STEM (science, technology, engineering, math), business, medicine, law, arts, social sciences, and more. Use our 'Subject' filter to explore specific areas of interest.",
    category: "Program Types & Subjects",
    icon: BookOpen
  },
  {
    id: "programs-2",
    question: "Are there virtual/remote internship options?",
    answer: "Yes! Many programs now offer virtual components or fully remote experiences. Look for location listings that mention 'Virtual' or 'Remote' when browsing opportunities.",
    category: "Program Types & Subjects",
    icon: MapPin
  },
  {
    id: "programs-3",
    question: "How long do most internships last?",
    answer: "Program durations vary widely. Use our 'Duration' filter to find programs that fit your schedule - from 1-week intensives to full summer programs lasting 8+ weeks. Most fall between 2-6 weeks.",
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
    question: "What does 'Rolling Admission' mean?",
    answer: "Rolling admission means applications are reviewed as they're received, rather than after a single deadline. Apply early for the best chances, as spots may fill before the final deadline.",
    category: "Deadlines & Timing",
    icon: Clock
  },
  {
    id: "timing-3",
    question: "I missed a deadline - are there still opportunities available?",
    answer: "Don't give up! Use our 'Due in' filter to find programs with later deadlines. Some programs have rolling admissions or accept late applications if space is available.",
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
    answer: "Check your active filters - they might be too restrictive. Try clearing filters or adjusting your search terms. Some programs may also have limited eligibility that doesn't match your current filter settings.",
    category: "Technical & Account Issues",
    icon: Search
  },
  {
    id: "technical-3",
    question: "How do I contact you about a problem or suggestion?",
    answer: "We'd love to hear from you! Use the contact information provided on our website to reach out with questions, technical issues, or suggestions for improving our platform.",
    category: "Technical & Account Issues",
    icon: Mail
  }
];

const categories = [
  { name: "Getting Started", icon: BookOpen, color: "bg-blue-50 text-blue-700" },
  { name: "Eligibility & Applications", icon: GraduationCap, color: "bg-green-50 text-green-700" },
  { name: "Costs & Financial Aid", icon: DollarSign, color: "bg-yellow-50 text-yellow-700" },
  { name: "Program Types & Subjects", icon: BookOpen, color: "bg-purple-50 text-purple-700" },
  { name: "Deadlines & Timing", icon: Clock, color: "bg-red-50 text-red-700" },
  { name: "Technical & Account Issues", icon: Shield, color: "bg-gray-50 text-gray-700" }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

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
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about finding and applying to high school internships
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-black-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
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
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-600 text-white'
                    : `bg-white text-gray-700 border border-gray-200 hover:bg-gray-50`
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedCategory) && (
          <div className="text-center mb-6">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Clear all filters
            </button>
            <span className="text-gray-500 text-sm ml-2">
              ({filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => {
            const Icon = faq.icon;
            const category = categories.find(cat => cat.name === faq.category);
            const isOpen = openItems.has(faq.id);

            return (
              <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${category?.color || 'bg-gray-50 text-gray-700'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {faq.question}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5">
                    <div className="pl-14">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No questions found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse different categories
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Show all questions
            </button>
          </div>
        )}

        {/* Still have questions? */}
        <div className="mt-16 text-center bg-blue-50 rounded-2xl p-8">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Can&apos;t find what you&apos;re looking for? We&apos;re here to help you find the perfect internship opportunity.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}