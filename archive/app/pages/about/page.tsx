"use client"

import React, { useState, useEffect } from 'react';
import { Search, Cpu, Github, Users, BookOpen, Lightbulb, ArrowRight, Sparkles, ExternalLink, Zap, Heart, Code2 } from 'lucide-react';

export default function AboutPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<null | 'process' | 'mission' | 'github' | 'cta'>(null);
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
        transitionDelay: `${index * 0.15}s`
    });

    const handleLinkClick = (url: string) => {
        if (typeof window !== 'undefined') {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 py-16 max-w-7xl relative">
                {/* Hero Section */}
                <div className="text-center mb-24" style={fadeInUp}>
                    <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                        Our Story & Mission
                    </div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        About{' '}
                        <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent animate-gradient bg-300% bg-gradient-to-r">
                            Internyl
                        </span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                        Making extracurricular opportunities easier to find
                    </p>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        (because honestly, who has time to search the entire internet?)
                    </p>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12 text-center">
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="text-3xl font-bold text-purple-600">1000+</div>
                            <div className="text-sm text-gray-600">Programs Found</div>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="text-3xl font-bold text-blue-600">24/7</div>
                            <div className="text-sm text-gray-600">AI Working</div>
                        </div>
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="text-3xl font-bold text-green-600">∞</div>
                            <div className="text-sm text-gray-600">Possibilities</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-20">

                    {/* What is Internyl - Enhanced */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center" style={staggerDelay(0)}>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                                    <Search className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-900 mb-4">What is Internyl?</h2>
                                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                        Internyl is an extracurricular program aggregator for high school students and undergraduates.
                                        Basically what that means is that our job is to find and display extracurricular programs that
                                        you can view, decide, and sign up for.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Internships</span>
                                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Research</span>
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Competitions</span>
                                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Programs</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-white/60 to-purple-50/40 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                <div className="text-center">
                                    <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-3xl w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <Zap className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Discovery</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Our intelligent system works around the clock to find the best opportunities for students like you.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Process Section */}
                    <div style={staggerDelay(1)}>
                        <div className="bg-gradient-to-br from-white/60 to-blue-50/40 backdrop-blur-sm border border-white/40 rounded-3xl p-10 shadow-xl">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-3 mb-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900">How Our AI Process Works</h2>
                                </div>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Behind the scenes, our AI system follows a carefully designed process to bring you the best opportunities
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 relative">
                                {/* Connection lines for desktop */}
                                <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200"></div>

                                {[
                                    {
                                        icon: Search,
                                        title: "Discover",
                                        desc: "AI scans the internet for new programs and opportunities",
                                        color: "from-blue-500 to-blue-600",
                                        detail: "Continuous monitoring of thousands of sources"
                                    },
                                    {
                                        icon: Code2,
                                        title: "Process",
                                        desc: "Information gets analyzed and organized intelligently",
                                        color: "from-purple-500 to-purple-600",
                                        detail: "Smart categorization and quality filtering"
                                    },
                                    {
                                        icon: Users,
                                        title: "Present",
                                        desc: "You find your perfect opportunities effortlessly",
                                        color: "from-green-500 to-green-600",
                                        detail: "Personalized recommendations just for you"
                                    }
                                ].map((step) => (
                                    <div key={step.title} className="text-center group relative">
                                        <div className={`bg-gradient-to-br ${step.color} p-6 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 relative z-10`}>
                                            <step.icon className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-3 text-xl">{step.title}</h3>
                                        <p className="text-gray-700 leading-relaxed mb-2 font-medium">{step.desc}</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">{step.detail}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Two Column Section - Enhanced */}
                    <div className="grid lg:grid-cols-2 gap-12" style={staggerDelay(2)}>

                        { }
                        <div
                            className="group cursor-pointer"
                            onMouseEnter={() => setHoveredCard('process')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={`bg-gradient-to-br from-white/60 to-purple-50/40 backdrop-blur-sm border border-white/40 rounded-3xl p-8 h-full transition-all duration-500 ${hoveredCard === 'process' ? 'shadow-2xl transform scale-105 border-purple-200' : 'shadow-lg hover:shadow-xl'}`}>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg transition-transform duration-300 ${hoveredCard === 'process' ? 'scale-110' : ''}`}>
                                        <Cpu className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">How do you find these programs?</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    First and foremost we use AI to discover extracurricular programs on the internet. We then
                                    summarize the information into a sort of &ldquo;form&rdquo; that standardizes the way to store and display
                                    the information, again using AI. The entire process is self sufficient needing very little
                                    human interference.
                                </p>
                                <div
                                    onClick={() => handleLinkClick('https://github.com/internyl-dev')}
                                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 cursor-pointer font-medium group/link bg-purple-50 hover:bg-purple-100 px-4 py-3 rounded-xl transition-all duration-300"
                                    onMouseEnter={() => setHoveredCard('github')}
                                    onMouseLeave={() => setHoveredCard('process')}
                                >
                                    <Github className="w-5 h-5" />
                                    <span>Visit our GitHub repository</span>
                                    <ExternalLink className={`w-4 h-4 transition-transform duration-200 ${hoveredCard === 'github' ? 'scale-110' : ''}`} />
                                </div>
                            </div>
                        </div>

                        {/* Mission - Enhanced */}
                        <div
                            className="group cursor-pointer"
                            onMouseEnter={() => setHoveredCard('mission')}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={`bg-gradient-to-br from-white/60 to-green-50/40 backdrop-blur-sm border border-white/40 rounded-3xl p-8 h-full transition-all duration-500 ${hoveredCard === 'mission' ? 'shadow-2xl transform scale-105 border-green-200' : 'shadow-lg hover:shadow-xl'}`}>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className={`bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg transition-transform duration-300 ${hoveredCard === 'mission' ? 'scale-110' : ''}`}>
                                        <Heart className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">What is your mission?</h2>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-gray-700 leading-relaxed">
                                        You probably didn&rsquo;t ask that, we&rsquo;re going to pretend you did though. What kickstarted the
                                        development of this website is a certain administrator at our school who worked tirelessly
                                        so that we the students would be able to find the extracurriculars they wanted to do.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        It&rsquo;s not necessarily our turn to do the same but we realized that this entire process could
                                        probably be done much easier given the new tools that were now at our disposal, specifically AI.
                                        We realized that with AI, a lot of resources to enhance education can be found much easier
                                        than it was before.
                                    </p>
                                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl">
                                        <p className="text-green-800 font-medium italic">
                                            &ldquo;Our mission: making educational resources easier to access for all students.&rdquo;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fun Quote Section - Enhanced */}
                    <div style={staggerDelay(3)}>
                        <div className="bg-gradient-to-br from-orange-100/80 to-pink-100/80 backdrop-blur-sm border border-white/40 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                            <div className="max-w-3xl mx-auto">
                                <div className="bg-gradient-to-br from-orange-400 to-pink-500 p-6 rounded-3xl w-20 h-20 mx-auto mb-8 flex items-center justify-center shadow-lg">
                                    <Lightbulb className="w-10 h-10 text-white" />
                                </div>
                                <blockquote className="text-2xl text-gray-800 italic leading-relaxed mb-6 font-medium">
                                    &ldquo;We actually made this website because we ended the year with no summer plans and a lot of free time.&rdquo;
                                </blockquote>
                                <cite className="text-lg text-gray-600 font-medium">- The Internyl Team</cite>
                                <p className="text-gray-500 mt-4 text-sm">
                                    (And now look what we&apos;ve built! Sometimes the best projects come from unexpected beginnings.)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced CTA Section */}
                    <div
                        style={staggerDelay(4)}
                        onMouseEnter={() => setHoveredCard('cta')}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        <div className={`bg-gradient-to-br from-white/70 to-purple-50/50 backdrop-blur-sm border border-white/40 rounded-3xl p-12 text-center shadow-2xl transition-all duration-500 ${hoveredCard === 'cta' ? 'transform scale-105' : ''}`}>
                            <div className="max-w-4xl mx-auto">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                        <Sparkles className="w-4 h-4" />
                                        Ready to get started?
                                    </div>
                                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                                        Discover your next opportunity
                                    </h2>
                                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                        Join thousands of students who&apos;ve found amazing programs through our platform.
                                        Start exploring internships, research programs, competitions, and more.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                    <button
                                        onClick={() => handleLinkClick('https://www.internyl.org/pages/internships')}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 group"
                                    >
                                        Start Exploring Programs
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </button>

                                    <button
                                        onClick={() => handleLinkClick('https://github.com/internyl-dev')}
                                        className="border-2 border-gray-300 hover:border-purple-500 text-gray-700 hover:text-purple-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-3 group bg-white/50 backdrop-blur-sm"
                                    >
                                        <Github className="w-5 h-5" />
                                        View Source Code
                                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Note - Enhanced */}
                    <div className="text-center space-y-4" style={staggerDelay(5)}>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            Want to see how we built this? Check out our technical documentation and code on{' '}
                            <button
                                onClick={() => handleLinkClick('https://github.com/internyl-dev')}
                                className="text-purple-600 hover:text-purple-700 cursor-pointer font-semibold border-b-2 border-purple-300 hover:border-purple-500 transition-all duration-300 inline-flex items-center gap-1"
                            >
                                GitHub
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </p>

                    </div>
                </div>
            </div>
        </div>
    );
}