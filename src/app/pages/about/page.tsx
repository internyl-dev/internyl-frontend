"use client"


import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Cpu, Target, Github, Users, BookOpen, Lightbulb } from 'lucide-react';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

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
    transitionDelay: `${index * 0.1}s`
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16" style={fadeInUp}>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Internyl
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Making extracurricular opportunities easier to find (because honestly, who has time to search the entire internet?)
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* What is Internyl */}
          <div className="lg:col-span-2" style={staggerDelay(0)}>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 h-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">What is Internyl?</h2>
                  <p className="text-gray-700 leading-relaxed text-base">
                    Internyl is an extracurricular program aggregator for high school students and undergraduates. 
                    Basically what that means is that our job is to find and display extracurricular programs that 
                    you can view, decide, and sign up for.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={staggerDelay(1)}>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 text-center">
              <div className="mb-4">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Programs Found</div>
              </div>
              <div className="border-t pt-4">
                <div className="text-lg font-semibold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">AI Working</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* How do you find programs */}
          <div style={staggerDelay(2)}>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <Cpu className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">How do you find these programs?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base mb-6">
                First and foremost we use AI to discover extracurricular programs on the internet. We then 
                summarize the information into a sort of "form" that standardizes the way to store and display 
                the information, again using AI. The entire process is self sufficient needing very little 
                human interference.
              </p>
              <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer text-sm font-medium">
                <Github className="w-4 h-4" />
                <span>Visit our GitHub repository</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Mission */}
          <div style={staggerDelay(3)}>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">What is your mission?</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base mb-4">
                You probably didn't ask that, we're going to pretend you did though. What kickstarted the 
                development of this website is a certain administrator at our school who worked tirelessly 
                so that we the students would be able to find the extracurriculars they wanted to do.
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                It's not necessarily our turn to do the same but we realized that this entire process could 
                probably done much easier given the new tools that were now at our disposal, specifically AI. 
                We realized that with AI, a lot of resources to enhance education can be found much easier 
                than it was before. That is our mission with this site, to make those resources easier to 
                access for all students.
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          <div className="lg:col-span-3" style={staggerDelay(4)}>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How Our AI Process Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Search, title: "Discover", desc: "AI scans the internet for programs", color: "blue" },
                  { icon: BookOpen, title: "Standardize", desc: "Information gets organized into forms", color: "purple" },
                  { icon: Users, title: "Present", desc: "You find your perfect opportunities", color: "green" }
                ].map((step, index) => (
                  <div key={step.title} className="text-center">
                    <div className={`bg-${step.color}-50 p-4 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
                      <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fun Quote */}
          <div style={staggerDelay(5)}>
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-6 shadow-sm border border-orange-200 h-full flex items-center">
              <div className="text-center">
                <Lightbulb className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <blockquote className="text-gray-700 text-sm italic leading-relaxed">
                  "We're basically that friend who knows about every cool opportunity but actually 
                  remembers to tell you about them."
                </blockquote>
                <cite className="text-xs text-gray-600 mt-3 block">- The Internyl Team</cite>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div style={staggerDelay(6)}>
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to discover your next opportunity?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of students who've found amazing programs through our platform. 
              Start exploring internships, research programs, competitions, and more.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
              Start Exploring Programs
            </button>
          </div>
        </div>

        {/* Tech Note */}
        <div className="mt-8 text-center" style={staggerDelay(7)}>
          <p className="text-sm text-gray-500">
            Want to see how we built this? Check out our technical documentation and code on{' '}
            <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">GitHub</span>
          </p>
        </div>
      </div>
    </div>
  );
}