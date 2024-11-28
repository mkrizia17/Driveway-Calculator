"use client";

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-800 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8" style={{ fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78, sans-serif' }}>
                <div className="bg-gray-800 rounded-lg p-8 text-gray-300">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-100">Privacy Policy</h1>
                    
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Introduction</h2>
                        <p className="mb-4">
                            At Driveway Calculator, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Information We Collect</h2>
                        <p className="mb-4">
                            We only collect information that is necessary to provide you with our calculator services. This may include:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-2">
                            <li>Usage data and calculations</li>
                            <li>Browser type and version</li>
                            <li>Device information</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-blue-400 mb-4">How We Use Your Information</h2>
                        <p className="mb-4">
                            We use the collected information to:
                        </p>
                        <ul className="list-disc list-inside mb-4 space-y-2">
                            <li>Provide and improve our calculator services</li>
                            <li>Analyze usage patterns to enhance user experience</li>
                            <li>Maintain and optimize website performance</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Data Protection</h2>
                        <p className="mb-4">
                            We implement appropriate security measures to protect your information from unauthorized access, alteration, or disclosure.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-blue-400 mb-4">Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about our Privacy Policy, please contact us at:
                        </p>
                        <p className="text-blue-400">support@drivewaycalculator.com</p>
                    </section>

                    <section>
                        <p className="text-sm text-gray-400">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
} 