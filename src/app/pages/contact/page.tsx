"use client"

import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Shield, HelpCircle, Users, Zap, ChevronRight, Sparkles } from 'lucide-react';

export default function ContactPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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

    const reasons = [
        {
            icon: <HelpCircle className="w-6 h-6" />,
            title: "General Inquiries",
            description: "Questions about our platform, features, or how to get started",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Partnership Opportunities", 
            description: "Interested in collaborating or becoming a partner with Internyl",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Technical Support",
            description: "Need help with technical issues or account problems",
            color: "from-green-500 to-green-600"
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Feedback & Suggestions",
            description: "Share your ideas to help us improve our platform",
            color: "from-orange-500 to-orange-600"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 py-16 max-w-7xl relative">
                {/* Header Section */}
                <div className="text-center mb-24" style={fadeInUp}>
                    <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                        We&apos;re Here to Help
                    </div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Get in{' '}
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient bg-300% bg-gradient-to-r">
                            Touch
                        </span>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                        We&apos;re here to help! Whether you have questions, feedback, or need support, our team is ready to assist you.
                    </p>
                </div>

                <div className="space-y-20">
                    {/* Report System Notice */}
                    <div style={staggerDelay(0)}>
                        <div className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 backdrop-blur-sm border border-yellow-200/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="flex items-start gap-4">
                                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        Report System Available
                                    </h3>
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        For urgent issues, policy violations, or security concerns, please use our 
                                        built-in report system for faster processing. For all other inquiries, 
                                        we&apos;d love to hear from you through the contact methods below.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reasons to Contact */}
                    <div style={staggerDelay(1)}>
                        <div className="bg-gradient-to-br from-white/60 to-blue-50/40 backdrop-blur-sm border border-white/40 rounded-3xl p-10 shadow-xl">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Reach Out?</h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Here are some common reasons students and partners get in touch with us
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {reasons.map((reason, index) => (
                                    <div
                                        key={index}
                                        className={`bg-gradient-to-br from-white/60 to-gray-50/40 backdrop-blur-sm border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-500 cursor-pointer group ${
                                            hoveredCard === index ? 'scale-105 border-blue-200' : ''
                                        }`}
                                        onMouseEnter={() => setHoveredCard(index)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`bg-gradient-to-br ${reason.color} p-3 rounded-xl shadow-lg transition-transform duration-300 ${
                                                hoveredCard === index ? 'scale-110' : ''
                                            }`}>
                                                <div className="text-white">
                                                    {reason.icon}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                                    {reason.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {reason.description}
                                                </p>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-all duration-300 ${
                                                hoveredCard === index ? 'translate-x-1' : ''
                                            }`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div style={staggerDelay(2)}>
                        <div className="bg-gradient-to-br from-white/70 to-blue-50/50 backdrop-blur-sm border border-white/40 rounded-3xl overflow-hidden shadow-2xl">
                            {/* Header */}
                            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-10 text-white relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                                <div className="text-center relative z-10">
                                    <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                                        <Mail className="w-10 h-10 text-white animate-bounce" />
                                    </div>
                                    <h2 className="text-4xl font-bold mb-4">Let&apos;s Connect</h2>
                                    <p className="text-xl text-blue-100 leading-relaxed">
                                        Send us an email and we&apos;ll get back to you as soon as possible
                                    </p>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-10">
                                <div className="text-center space-y-8">
                                    <div className="bg-gradient-to-br from-white/60 to-gray-50/40 backdrop-blur-sm border border-white/40 px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-4 group">
                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <a 
                                            href="mailto:contactinternyl@gmail.com"
                                            className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300"
                                        >
                                            contactinternyl@gmail.com
                                        </a>
                                    </div>
                                    
                                    <div className="max-w-2xl mx-auto">
                                        <div className="bg-gradient-to-br from-white/50 to-blue-50/30 backdrop-blur-sm border border-white/30 rounded-2xl p-6 shadow-lg">
                                            <p className="text-lg text-gray-700 leading-relaxed">
                                                We typically respond within 24-48 hours during business days. 
                                                For urgent matters, please indicate the priority level in your subject line.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <a
                                            href="mailto:contactinternyl@gmail.com?subject=Hello from Internyl Website"
                                            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                        >
                                            <Mail className="w-6 h-6" />
                                            <span>Send Email</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Message */}
                    <div style={staggerDelay(3)}>
                        <div className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                            <div className="max-w-3xl mx-auto">
                                <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-xl text-gray-800 leading-relaxed font-medium italic">
                                    &ldquo;Thank you for being part of the Internyl community! 
                                    Your feedback and questions help us build a better platform for everyone.&rdquo;
                                </p>
                                <cite className="text-lg text-gray-600 font-medium mt-4 block">- The Internyl Team</cite>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}