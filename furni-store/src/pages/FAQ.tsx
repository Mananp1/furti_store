import {
  FAQLayout,
  FAQHeader,
  FAQContent,
  useFAQData,
} from "@/components/FooterPages";

const FAQ = () => {
  const { faqData } = useFAQData();

  return (
    <FAQLayout>
      <FAQHeader />
      <FAQContent items={faqData} />
    </FAQLayout>
  );
};

export default FAQ;
