export const useFAQData = () => {
  const faqData = [
    {
      question: "What is your return policy?",
      answer:
        "You can return unused items in their original packaging within 30 days for a refund or exchange. Contact support for assistance.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Track your order using the link provided in your confirmation email, or log into your account to view tracking details.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "At this time, we do not offer international shipping. We currently only ship within the country.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We are in the process of finalizing our payment methods. Stay tuned for more updates soon! Currently, we are considering options like credit/debit cards and PayPal.",
    },
    {
      question: "What if I receive a damaged item?",
      answer:
        "Please contact our support team within 48 hours of delivery with photos of the damaged item. We'll arrange a replacement or refund.",
    },
  ];

  return {
    faqData,
  };
};
