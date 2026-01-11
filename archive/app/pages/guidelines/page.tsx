"use client"

import { useState, useEffect } from 'react';
import { Sparkles, Clock, Users, Shield } from 'lucide-react';

export default function CommunityGuidelinesPage() {
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
        transitionDelay: `${index * 0.15}s`
    });

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 py-16 max-w-7xl relative">
                {/* Header */}
                <div className="text-center mb-24" style={fadeInUp}>
                    <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                        Building Our Community Standards
                    </div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Community{' '}
                        <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent animate-gradient bg-300% bg-gradient-to-r">
                            Guidelines
                        </span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                        Creating a safe and supportive space for all students
                    </p>
                </div>

                {/* Main Work in Progress Section */}
                <div className="flex justify-center" style={staggerDelay(0)}>
                    <div className="bg-gradient-to-br from-white/70 to-purple-50/50 backdrop-blur-sm border border-white/40 rounded-3xl p-16 shadow-2xl hover:shadow-3xl transition-all duration-500 text-center max-w-4xl">
                        <div className="space-y-8">
                            {/* Animated Icon */}
                            <div className="relative">
                                <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-8 rounded-3xl w-24 h-24 mx-auto flex items-center justify-center shadow-lg animate-pulse">
                                    <Clock className="w-12 h-12 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-full shadow-lg animate-bounce">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            </div>

                            {/* Main Message */}
                            <div className="space-y-6">
                                <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                                    Work in Progress
                                </h2>
                                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                                    We&apos;re currently busy. Just be nice to others!
                                </p>
                            </div>

                            {/* Features Preview */}
                            <div className="grid sm:grid-cols-2 gap-6 mt-12">
                                <div className="bg-gradient-to-br from-white/50 to-blue-50/30 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl w-12 h-12 mx-auto mb-4 flex items-center justify-center shadow-lg">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Safety First</h3>
                                    <p className="text-gray-600 text-sm">Clear policies to protect all community members</p>
                                </div>

                                <div className="bg-gradient-to-br from-white/50 to-purple-50/30 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl w-12 h-12 mx-auto mb-4 flex items-center justify-center shadow-lg">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Respectful Community</h3>
                                    <p className="text-gray-600 text-sm">Guidelines for positive interactions and mutual respect</p>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="pt-8">
                                <div className="bg-gradient-to-br from-white/40 to-gray-50/20 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
                                    <p className="text-lg text-gray-700 mb-4 font-medium">
                                        Coming Soon!
                                    </p>
                                    <p className="text-gray-600 leading-relaxed">
                                        We are crumbling under the pressure of school, we&apos;ll do it eventually.
                                    </p>
                                </div>
                            </div>

                            {/* Progress Indicator */}
                            <div className="pt-6">
                                <div className="bg-white/40 rounded-full h-3 shadow-inner overflow-hidden">
                                    <div className="bg-gradient-to-r from-purple-500 to-blue-600 h-full rounded-full shadow-lg animate-pulse" style={{ width: '65%' }}></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2 font-medium">In Development</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}