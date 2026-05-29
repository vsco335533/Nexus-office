// frontend/components/pages/HelpPage.jsx
'use client';

import * as Icons from 'lucide-react';
import { useState } from 'react';

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: 'How do I create a new note?',
      answer: 'Click on "My Notes" from the sidebar and then click the "Create Note" button. Start typing to begin editing your note.'
    },
    {
      question: 'Can I share notes with others?',
      answer: 'Yes! In the note editor, look for the share option to invite others to view or edit your notes.'
    },
    {
      question: 'How do I organize my notes?',
      answer: 'You can organize notes using projects, tags, and starred notes. Visit the respective sections in the sidebar to manage your organization.'
    },
    {
      question: 'Can I export my notes?',
      answer: 'Yes! Go to the "Export" section in the Tools menu to download your notes in JSON, DOCX, or HTML format.'
    },
    {
      question: 'What happens to deleted notes?',
      answer: 'Deleted notes are moved to Trash. You can restore them within 30 days or permanently delete them.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Your data is encrypted and securely stored on our servers. We recommend enabling two-factor authentication for additional security.'
    }
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page Header */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h1 className="text-3xl font-bold text-ash-900 dark:text-white">Help & Support</h1>
        <p className="text-ash-600 dark:text-ash-400 mt-1">Find answers to common questions</p>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Need More Help?</h2>
        <p className="mb-4">Can't find what you're looking for? Our support team is here to help.</p>
        <button className="bg-white text-primary-600 font-semibold px-6 py-2 rounded-lg hover:bg-primary-50 transition-colors">
          Contact Support
        </button>
      </div>

      {/* FAQs */}
      <div>
        <h2 className="text-2xl font-bold text-ash-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-ash-800 rounded-xl border border-ash-200 dark:border-ash-700 overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-ash-50 dark:hover:bg-ash-700 transition-colors"
              >
                <h3 className="font-semibold text-ash-900 dark:text-white">{faq.question}</h3>
                <Icons.ChevronDown className={`w-5 h-5 text-ash-600 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {expandedFaq === idx && (
                <div className="px-4 pb-4 border-t border-ash-200 dark:border-ash-700">
                  <p className="text-ash-600 dark:text-ash-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Documentation Links */}
      <div className="bg-white dark:bg-ash-800 rounded-xl p-6 border border-ash-200 dark:border-ash-700">
        <h3 className="font-bold text-ash-900 dark:text-white mb-4 flex items-center gap-2">
          <Icons.BookOpen className="w-5 h-5" />
          Documentation & Resources
        </h3>
        <ul className="space-y-2">
          <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Getting Started Guide</a></li>
          <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Keyboard Shortcuts</a></li>
          <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a></li>
          <li><a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a></li>
        </ul>
      </div>
    </div>
  );
}
