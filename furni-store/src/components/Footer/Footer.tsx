import {
  FooterLayout,
  FooterLogo,
  FooterNewsletter,
  FooterCopyright,
  FooterContent,
  FooterBottom,
  useFooterLogic,
} from "./index";

const Footer = () => {
  const { footerLinks, handleNewsletterSubmit } = useFooterLogic();

  return (
    <FooterLayout>
      <FooterContent>
        <FooterLogo links={footerLinks} />
        <FooterNewsletter onSubmit={handleNewsletterSubmit} />
      </FooterContent>
      <FooterBottom>
        <FooterCopyright />
      </FooterBottom>
    </FooterLayout>
  );
};

export default Footer;
