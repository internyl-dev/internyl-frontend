"use client";

import Link from "next/link";
// import { useState } from "react";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

export default function Footer() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes footerGlow {
            0%, 100% {
              text-shadow: 0 0 0px rgba(59, 130, 246, 0);
            }
            50% {
              text-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
            }
          }
          
          @keyframes shimmerFooter {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          @keyframes socialBounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0) scale(1);
            }
            40% {
              transform: translateY(-8px) scale(1.1);
            }
            60% {
              transform: translateY(-4px) scale(1.05);
            }
          }
          
          @keyframes linkFloat {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-2px);
            }
          }
          
          @keyframes iconPulse {
            0%, 100% {
              transform: scale(1);
              filter: drop-shadow(0 0 0px rgba(59, 130, 246, 0));
            }
            50% {
              transform: scale(1.1);
              filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.3));
            }
          }
          
          .footer-logo:hover {
            animation: footerGlow 2s ease-in-out infinite;
            background: linear-gradient(45deg, #1f2937, #3b82f6, #6366f1, #1f2937);
            background-size: 400% 400%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmerFooter 3s ease-in-out infinite, footerGlow 2s ease-in-out infinite;
          }
          
          .footer-link {
            position: relative;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .footer-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
            transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .footer-link:hover::before {
            left: 100%;
          }
          
          .footer-link:hover {
            animation: linkFloat 1s ease-in-out infinite;
            background: rgba(59, 130, 246, 0.05);
            transform: translateX(4px);
          }
          
          .footer-link:hover svg {
            animation: iconPulse 1s ease-in-out infinite;
          }
          
          .social-link {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          
          .social-link::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent 70%);
            border-radius: 50%;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translate(-50%, -50%);
          }
          
          .social-link:hover::before {
            width: 50px;
            height: 50px;
          }
          
          .social-link:hover {
            animation: socialBounce 0.8s ease-in-out;
            transform: scale(1.1);
          }
          
          .social-linkedin:hover {
            color: #0077b5;
          }
          
          .social-twitter:hover {
            color: #1da1f2;
          }
          
          .social-instagram:hover {
            color: #e4405f;
          }
          
          .social-facebook:hover {
            color: #1877f2;
          }
          
          .footer-section {
            position: relative;
          }
          
          .footer-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .footer-section:hover::before {
            opacity: 1;
          }
          
          .footer-container {
            background: linear-gradient(135deg, rgba(249, 250, 251, 0.8), rgba(243, 244, 246, 0.9));
            backdrop-filter: blur(16px) saturate(200%);
            border-top: 1px solid rgba(229, 231, 235, 0.8);
          }
          
          @media (max-width: 640px) {
            .footer-link {
              padding: 6px 8px;
              font-size: 0.875rem;
            }
            
            .social-link {
              padding: 8px;
            }
          }
        `,
        }}
      />

      <footer className="footer-container mt-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-7 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="footer-section lg:col-span-2">
              <h3 className="footer-logo text-2xl font-bold text-gray-900 mb-4 cursor-pointer tracking-[-0.05em]">
                internyl
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">
                Connecting talented students with incredible internship
                opportunities. Build your career, gain experience, and make
                meaningful connections in your field.
              </p>
              <div className="flex space-x-3">
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  className="social-link social-linkedin p-2 rounded-full"
                  aria-label="Follow us on LinkedIn"
                >
                  <LinkedInIcon />
                </Link>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  className="social-link social-twitter p-2 rounded-full"
                  aria-label="Follow us on Twitter"
                >
                  <TwitterIcon />
                </Link>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="social-link social-instagram p-2 rounded-full"
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon />
                </Link>
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  className="social-link social-facebook p-2 rounded-full"
                  aria-label="Follow us on Facebook"
                >
                  <FacebookIcon />
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="footer-link text-gray-600 hover:text-blue-600"
                  >
                    <InfoOutlinedIcon fontSize="small" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/internships"
                    className="footer-link text-gray-600 hover:text-emerald-600"
                  >
                    <BusinessOutlinedIcon fontSize="small" />
                    Browse Internships
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/contact"
                    className="footer-link text-gray-600 hover:text-purple-600"
                  >
                    <EmailOutlinedIcon fontSize="small" />
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="footer-section">
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">
                Support & Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/pages/faq"
                    className="footer-link text-gray-600 hover:text-green-600"
                  >
                    <HelpOutlineIcon fontSize="small" />
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/guidelines"
                    className="footer-link text-gray-600 hover:text-amber-600"
                  >
                    <PolicyOutlinedIcon fontSize="small" />
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/report"
                    className="footer-link text-gray-600 hover:text-red-600"
                  >
                    <ReportProblemOutlinedIcon fontSize="small" />
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
