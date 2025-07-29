interface FAQHeaderProps {
  title?: string;
}

export const FAQHeader = ({
  title = "Questions & Answers",
}: FAQHeaderProps) => {
  return (
    <h2 className="text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tight">
      {title}
    </h2>
  );
};
