import ContactInfo from "../components/about/ContactInfo";
import FollowUs from "../components/about/FollowUs";

function Contact() {
    return (
      <section className="mb20">
        <div className="grid grid-cols-5">
          <div className="col-span-3 max-md:col-span-full">
            <ContactInfo />
          </div>
          <div className="col-span-2 max-md:col-span-full">
            <FollowUs />
          </div>
        </div>
      </section>
    );
  }
  
  export default Contact;