import { useState } from 'react';

const faqs = [
  {
    question: 'How do I create a new board?',
    answer: 'To create a new board, click on the "New Board" button in the dashboard. You can then customize the board settings and add members.'
  },
  {
    question: 'How do I invite team members?',
    answer: 'You can invite team members by clicking the "Invite" button on your board. Enter their email addresses and they will receive an invitation to join.'
  },
  {
    question: 'Can I customize my board?',
    answer: 'Yes, you can customize your board by changing its theme, layout, and adding custom fields. Go to board settings to make these changes.'
  },
  {
    question: 'How do I delete a board?',
    answer: 'To delete a board, go to board settings and click on "Delete Board". Please note that this action cannot be undone.'
  },
  {
    question: 'How do I change my password?',
    answer: 'You can change your password in the Profile settings. Click on "Change Password" and follow the instructions.'
  }
];

const Help = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Help Center</h1>
        
        <div className="space-y-8">
          {/* Search Section */}
          <div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-2 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* FAQs Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-md">
                  <button
                    className="w-full px-4 py-3 text-left flex justify-between items-center"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeIndex === index && (
                    <div className="px-4 py-3 bg-gray-50 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Need More Help?</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                If you can't find what you're looking for, our support team is here to help.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 