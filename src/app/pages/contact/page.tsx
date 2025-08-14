"use client"

import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Shield, HelpCircle, Users, Zap, ChevronRight } from 'lucide-react';

export default function ContactPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const reasons = [
        {
            icon: <HelpCircle className="w-6 h-6" />,
            title: "General Inquiries",
            description: "Questions about our platform, features, or how to get started"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Partnership Opportunities",
            description: "Interested in collaborating or becoming a partner with Internyl"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Technical Support",
            description: "Need help with technical issues or account problems"
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Feedback & Suggestions",
            description: "Share your ideas to help us improve our platform"
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className={`text-center mb-16 transform transition-all duration-1000 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Get in{' '}
                        <span className="text-transparent bg-clip-text bg-blue-600 font-bold">
                            Touch
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        We&apos;re here to help! Whether you have questions, feedback, or need support, 
                        our team is ready to assist you.
                    </p>
                </div>

                {/* Report System Notice */}
                <div className={`mb-12 transform transition-all duration-1000 delay-200 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-sm">
                        <div className="flex items-start">
                            <Shield className="w-6 h-6 text-yellow-600 mt-1 mr-4 flex-shrink-0" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Report System Available
                                </h3>
                                <p className="text-gray-700">
                                    For urgent issues, policy violations, or security concerns, please use our 
                                    built-in report system for faster processing. For all other inquiries, 
                                    we&apos;d love to hear from you through the contact methods below.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reasons to Contact */}
                <div className={`mb-16 transform transition-all duration-1000 delay-300 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        Why Reach Out?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reasons.map((reason, index) => (
                            <div
                                key={index}
                                className={`group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 cursor-pointer border border-gray-100 ${
                                    hoveredCard === index ? 'scale-105 -translate-y-2' : ''
                                }`}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="bg-blue-600 p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                                        {reason.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {reason.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {reason.description}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Information */}
                <div className={`transform transition-all duration-1000 delay-500 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-blue-600 p-8 text-white">
                            <div className="text-center">
                                <Mail className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                                <h2 className="text-3xl font-bold mb-2">Let&apos;s Connect</h2>
                                <p className="text-blue-100">
                                    Send us an email and we&apos;ll get back to you as soon as possible
                                </p>
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="text-center space-y-6">
                                <div className="inline-flex items-center space-x-3 bg-gray-50 px-6 py-4 rounded-full border-2 border-gray-200 hover:border-blue-400 transition-colors duration-300 group">
                                    <Mail className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                                    <a 
                                        href="mailto:contactinternyl@gmail.com"
                                        className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300"
                                    >
                                        contactinternyl@gmail.com
                                    </a>
                                </div>
                                
                                <div className="max-w-md mx-auto">
                                    <p className="text-gray-600 text-center leading-relaxed">
                                        We typically respond within 24-48 hours during business days. 
                                        For urgent matters, please indicate the priority level in your subject line.
                                    </p>
                                </div>

                                <div className="pt-6">
                                    <a
                                        href="mailto:contactinternyl@gmail.com?subject=Hello from Internyl Website"
                                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <Mail className="w-5 h-5" />
                                        <span className="font-semibold">Send Email</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className={`text-center mt-12 transform transition-all duration-1000 delay-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    <p className="text-gray-500 italic">
                        Thank you for being part of the Internyl community! 
                        Your feedback and questions help us build a better platform for everyone.
                    </p>
                </div>
            </div>
        </div>
    );
}