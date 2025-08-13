"use client"

import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Cpu, Target, Github, Users, BookOpen, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<null | 'process' | 'mission'>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeInUp = {
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.6s ease-out'
  };

  const staggerDelay = (index: number) => ({
    ...fadeInUp,
    transitionDelay: `${index * 0.15}s`
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-8 py-16 max-w-6xl">
        {/* Hero Section - More Spacious */}
        <div className="text-center mb-24" style={fadeInUp}>
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/20 text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Our Story & Mission
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            About <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Internyl</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Making extracurricular opportunities easier to find <br/>
            <span className="text-gray-500 text-lg">(because honestly, who has time to search the entire internet?)</span>
          </p>
        </div>

        {/* Main Content - More Organic Layout */}
        <div className="space-y-16">
          
          {/* What is Internyl - Hero Style */}
          <div className="grid lg:grid-cols-5 gap-8 items-center" style={staggerDelay(0)}>
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">What is Internyl?</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Internyl is an extracurricular program aggregator for high school students and undergraduates. 
                    Basically what that means is that our job is to find and display extracurricular programs that 
                    you can view, decide, and sign up for.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-white/40 backdrop-blur-sm border border-white/30 rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300">
                <Users className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">1000+</div>
                <div className="text-gray-600 mb-4">Programs Found</div>
                <div className="border-t border-white/40 pt-4">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">AI Working</div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Section - More Visual */}
          <div className="grid lg:grid-cols-2 gap-12" style={staggerDelay(1)}>
            
            {/* How we find programs */}
            <div 
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredCard('process')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-gradient-to-br from-white/50 to-purple-50/50 backdrop-blur-sm border border-white/40 rounded-3xl p-8 transition-all duration-300 ${hoveredCard === 'process' ? 'shadow-2xl transform scale-105' : 'shadow-lg'}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg">
                    <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">How do you find these programs?</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  First and foremost we use AI to discover extracurricular programs on the internet. We then 
                  summarize the information into a sort of "form" that standardizes the way to store and display 
                  the information, again using AI. The entire process is self sufficient needing very little 
                  human interference.
                </p>
                <div className="flex items-center gap-2 text-purple-600 hover:text-purple-700 cursor-pointer font-medium group">
                  <Github className="w-5 h-5" />
                  <span>Visit our GitHub repository</span>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${hoveredCard === 'process' ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </div>

            {/* Mission */}
            <div 
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredCard('mission')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-gradient-to-br from-white/50 to-green-50/50 backdrop-blur-sm border border-white/40 rounded-3xl p-8 transition-all duration-300 ${hoveredCard === 'mission' ? 'shadow-2xl transform scale-105' : 'shadow-lg'}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">What is your mission?</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You probably didn't ask that, we're going to pretend you did though. What kickstarted the 
                  development of this website is a certain administrator at our school who worked tirelessly 
                  so that we the students would be able to find the extracurriculars they wanted to do.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  It's not necessarily our turn to do the same but we realized that this entire process could 
                  probably done much easier given the new tools that were now at our disposal, specifically AI. 
                  We realized that with AI, a lot of resources to enhance education can be found much easier 
                  than it was before. That is our mission with this site, to make those resources easier to 
                  access for all students.
                </p>
              </div>
            </div>
          </div>

          {/* Process Section - More Visual Flow */}
          <div className="grid lg:grid-cols-4 gap-8" style={staggerDelay(2)}>
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-white/60 to-blue-50/40 backdrop-blur-sm border border-white/40 rounded-3xl p-10 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">How Our AI Process Works</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: Search, title: "Discover", desc: "AI scans the internet for programs", color: "from-blue-500 to-blue-600" },
                    { icon: BookOpen, title: "Standardize", desc: "Information gets organized into forms", color: "from-purple-500 to-purple-600" },
                    { icon: Users, title: "Present", desc: "You find your perfect opportunities", color: "from-green-500 to-green-600" }
                  ].map((step, index) => (
                    <div key={step.title} className="text-center group">
                      <div className={`bg-gradient-to-br ${step.color} p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                      {index < 2 && (
                        <ArrowRight className="w-5 h-5 text-gray-400 mx-auto mt-4 hidden md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fun Quote - More Personality */}
            <div style={staggerDelay(3)}>
              <div className="bg-gradient-to-br from-orange-100/80 to-pink-100/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-xl h-full flex items-center hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <blockquote className="text-gray-700 italic leading-relaxed mb-4">
                    "We actually made this website because we ended the year with no summer plans and a lot of free time."
                  </blockquote>
                  <cite className="text-sm text-gray-600 font-medium">- The Internyl Team</cite>
                </div>
              </div>
            </div>
                  </div>

                  {/* CTA Section - More Engaging */}
                  <div style={staggerDelay(4)}>
                      <div className="bg-gradient-to-br from-white/70 to-purple-50/50 backdrop-blur-sm border border-white/40 rounded-3xl p-12 text-center shadow-2xl">
                          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to discover your next opportunity?</h2>
                          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                              Join thousands of students who've found amazing programs through our platform.
                              Start exploring internships, research programs, competitions, and more.
                          </p>
                          <a
                              href="https://www.internyl.org/pages/internships"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block"
                          >
                              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 mx-auto">
                                  Start Exploring Programs
                                  <ArrowRight className="w-5 h-5" />
                              </button>
                          </a>
                      </div>
                  </div>

                  {/* Bottom Note - Subtle */}
          <div className="text-center" style={staggerDelay(5)}>
            <p className="text-gray-500 leading-relaxed">
              Want to see how we built this? Check out our technical documentation and code on{' '}
              <span className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium border-b border-purple-300 hover:border-purple-500 transition-colors duration-200">GitHub</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}