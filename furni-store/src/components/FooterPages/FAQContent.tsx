import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQContentProps {
  items: FAQItem[];
  defaultOpen?: string;
}

export const FAQContent = ({
  items,
  defaultOpen = "question-0",
}: FAQContentProps) => {
  return (
    <Accordion type="single" className="mt-6" defaultValue={defaultOpen}>
      {items.map(({ question, answer }, index) => (
        <AccordionItem key={question} value={`question-${index}`}>
          <AccordionTrigger className="text-left text-lg">
            {question}
          </AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
