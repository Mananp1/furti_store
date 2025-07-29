import {
  FooterLayout,
  FooterLogo,
  FooterNewsletter,
  FooterCopyright,
  FooterContent,
  FooterBottom,
  useFooterLogic,
} from "./index";

interface FooterPageProps {
  customLinks?: Array<{ title: string; to: string }>;
  newsletterTitle?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  companyName?: string;
  companyUrl?: string;
  additionalText?: string;
}

export const FooterPage = ({
  customLinks,
  newsletterTitle,
  newsletterPlaceholder,
  newsletterButtonText,
  companyName,
  companyUrl,
  additionalText,
}: FooterPageProps) => {
  const { footerLinks } = useFooterLogic();
  const links = customLinks || footerLinks;

  return (
    <FooterLayout>
      <FooterContent>
        <FooterLogo links={links} />
        <FooterNewsletter
          title={newsletterTitle}
          placeholder={newsletterPlaceholder}
          buttonText={newsletterButtonText}
        />
      </FooterContent>
      <FooterBottom>
        <FooterCopyright
          companyName={companyName}
          companyUrl={companyUrl}
          additionalText={additionalText}
        />
      </FooterBottom>
    </FooterLayout>
  );
};
