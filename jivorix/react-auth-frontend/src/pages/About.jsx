import AboutDesc from "../components/about/AboutDesc";
import FAQ from "../components/about/FAQ";
import PrivacyPolicy from "../components/about/PrivacyPolicy";
import TermsAndConditions from "../components/about/TermsAndConditions";
import DividerLine from "../components/DividerLine";
import Contact from "./Contact";

function About() {
    return (
      <section>
        <div className="mb30">
          <AboutDesc />
        </div>
        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-8 max-lg:gap-6 max-md:gap-4">
          <TermsAndConditions />
          <PrivacyPolicy />
        </div>
        <DividerLine />
        <div className="w-full">
          <FAQ />
        </div>
        <div>
          <Contact />
        </div>
      </section>
    );
  }
  
  export default About;