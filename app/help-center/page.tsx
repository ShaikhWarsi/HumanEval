import React from 'react';

const HelpCenterPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Help Center</h1>
      <p className="text-lg mb-4">
        Welcome to the Help Center. Here you can find answers to frequently asked questions,
        troubleshooting tips, and guides to help you make the most of Humval2.
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium">Q: How do I start a new test?</h3>
            <p className="text-lg">A: Navigate to the "Tests" section from the main menu and select the test you wish to start.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Q: How can I track my progress?</h3>
            <p className="text-lg">A: Your progress is automatically saved and can be viewed on your "Dashboard" page.</p>
          </div>
          <div>
            <h3 className="text-xl font-medium">Q: Is my data secure?</h3>
            <p className="text-lg">A: Yes, we prioritize your data security and use industry-standard encryption to protect your information.</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Need More Help?</h2>
        <p className="text-lg mb-4">
          If you can't find the answer to your question here, please don't hesitate to contact our support team.
          You can reach us via the <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a> page.
        </p>
      </div>
    </div>
  );
};

export default HelpCenterPage;