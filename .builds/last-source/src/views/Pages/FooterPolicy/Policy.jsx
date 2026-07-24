import React, { useEffect } from 'react'
import logo from "../../../assets/images/logo/unique-logo.png";
import "./Index.scss"
import style from "../LandingPage/index.module.scss";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { BsWhatsapp, BsFacebook, BsTwitter, BsLinkedin } from "react-icons/bs";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const Policy = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [])


  return (
    <div id='policycontainer'>
      <div id='header'>
        <img src={logo} alt="" />
      </div>
      <div id="wrapper">
        <p id='contentheader'>Privacy Policy</p>
        <div id="contentspeader"></div>
        <p id="updated-date">Last updated on Oct 12th 2023</p>
        <p className='content-text'>This privacy policy sets out how Unique World Placement
          uses and protects any information that you give
          Unique World Placement when you use this website.
        </p>
        <p className='content-text'>
          Unique World Placement is committed to ensuring that your
          privacy is protected. Should we ask you to provide certain information by
          which you can be identified when using this website, and then you can be
          assured that it will only be used in accordance with this privacy statement.
        </p>
        <p className='content-text'>
          Unique World Placement may change this policy from time
          to time by updating this page. You should check this page from time to time
          to ensure that you are happy with any changes.
        </p>

        <p className='content-text'>
          <strong>
            We may collect the following information:
          </strong>
        </p>


        <ul>
          <li className='content-text list-text'>
            Name and job title
          </li>
          <li className='content-text list-text'>
            Contact information including email address
          </li>
          <li className='content-text list-text'>
            Demographic information such as postcode, preferences and interests
          </li>
          <li className='content-text list-text'>
            Other information relevant to customer surveys and/or offers
          </li>
        </ul>

        <p className='content-text'>
          <strong>
            What we do with the information we gather
          </strong>
        </p>

        <p className='content-text'>
          We require this information to understand your needs and provide you with a
          better service, and in particular for the following reasons:
        </p>

        <ul>
          <li className='content-text list-text'>
            Internal record keeping
          </li>
          <li className='content-text list-text'>
            We may use the information to improve our products and services.
          </li>
          <li className='content-text list-text'>
            We may periodically send promotional emails about new products, special
            offers or other information which we think you may find interesting
            using the email address which you have provided.
          </li>
          <li className='content-text list-text'>
            From time to time, we may also use your information to contact you for
            market research purposes. We may contact you by email, phone, fax or
            mail. We may use the information to customise the website according to
            your interests.
          </li>
        </ul>

        <p className='content-text'>
          We are committed to ensuring that your information is secure. In order to
          prevent unauthorised access or disclosure we have put in suitable measures.
        </p>

        <p className='content-text'>
          <strong>
            How we use cookies
          </strong>
        </p>

        <p className='content-text'>
          A cookie is a small file which asks permission to be placed on your
          computer's hard drive. Once you agree, the file is added and the cookie
          helps analyses web traffic or lets you know when you visit a particular
          site. Cookies allow web applications to respond to you as an individual. The
          web application can tailor its operations to your needs, likes and dislikes
          by gathering and remembering information about your preferences.
        </p>

        <p className='content-text'>
          We use traffic log cookies to identify which pages are being used. This
          helps us analyses data about webpage traffic and improve our website in
          order to tailor it to customer needs. We only use this information for
          statistical analysis purposes and then the data is removed from the system.
        </p>

        <p className='content-text'>
          Overall, cookies help us provide you with a better website, by enabling us
          to monitor which pages you find useful and which you do not. A cookie in no
          way gives us access to your computer or any information about you, other
          than the data you choose to share with us.
        </p>

        <p className='content-text'>
          You can choose to accept or decline cookies. Most web browsers automatically
          accept cookies, but you can usually modify your browser setting to decline
          cookies if you prefer. This may prevent you from taking full advantage of
          the website.
        </p>

        <p className='content-text'>
          <strong>
            Controlling your personal information
          </strong>
        </p>

        <p className='content-text'>
          You may choose to restrict the collection or use of your personal
          information in the following ways:
        </p>


        <ul>
          <li className='content-text list-text'>
            whenever you are asked to fill in a form on the website, look for the
            box that you can click to indicate that you do not want the information
            to be used by anybody for direct marketing purposes
          </li>
          <li className='content-text list-text'>
            if you have previously agreed to us using your personal information for
            direct marketing purposes, you may change your mind at any time by
            writing to or emailing us at
            helpuniqueworld@gmail.com
          </li>
        </ul>


        <p className='content-text'>
          We will not sell, distribute or lease your personal information to third
          parties unless we have your permission or are required by law to do so. We
          may use your personal information to send you promotional information about
          third parties which we think you may find interesting if you tell us that
          you wish this to happen.
        </p>

        <p className='content-text'>

          If you believe that any information we are holding on you is incorrect or
          incomplete, please write to or email us as soon as possible, at the above
          address. We will promptly correct any information found to be incorrect.

        </p>







      </div>
      <section>
        <footer id="landingFooter" className="landingFooter">
          <div
            className="footer-top"
            style={{ borderBottom: "1px solid #000" }}
          >
            <div className={("container", style["container"])}>
              <div className="row row-adjustment">
                <div
                  className="col-xxl-2 col-md-12 col-lg-3 footer-info"
                  style={{
                    display: "flex",

                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <a href="#" className="logo d-flex align-items-center">
                      <img src={logo} alt="Uniqueworld Logo" />
                    </a>
                  </div>
                  <div></div>

                  <br />
                </div>

                <div className="col-md-6 col-sm-6 col-xxl-2 col-md-4 col-lg-2 col-12 footer-links">
                  <div>
                    <h4>Contacts</h4>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "left",
                        color: "#000",
                      }}
                    >
                      <div
                        style={{
                          marginRight: "5px",
                        }}
                      >
                        <IoLocationOutline />
                      </div>
                      <div style={{ textAlign: "left" }}>
                        Address: T-1, 3rd Floor, Time Square Building, Beside
                        Bhulkabhavan School, Adajan, Surat, Gujarat 395009{" "}
                        <br /> <br />
                      </div>
                    </p>
                    <p
                      style={{
                        display: "flex",
                        alignItems: "left",
                        color: "#000",
                      }}
                    >
                      <div
                        style={{
                          marginRight: "5px",
                        }}
                      >
                        <IoCallOutline />
                      </div>
                      <div style={{ textAlign: "left" }}>
                        Dhaval Gandhi: 9974877260 <br />
                      </div>
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-xxl-2 col-md-4 col-lg-2 col-12 footer-links">
                  <h4>Jobs by location</h4>
                  <ul>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/job/ahmedabad"
                      >
                        Jobs in Ahmedabad
                      </a>
                    </li>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/job/surat"
                      >
                        Jobs in Surat
                      </a>
                    </li>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/job/valsad"
                      >
                        Jobs in Valsad
                      </a>
                    </li>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/job/gandhinagar"
                      >
                        Jobs in Gandhinagar
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-md-6 col-sm-6 col-xxl-2 col-md-4 col-lg-2 col-12 footer-links">
                  <h4>Resources</h4>
                  <ul>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/contact-us"
                      >
                        Support
                      </a>
                    </li>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/faq"
                      >
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/contact-us"
                      >
                        Contact Details
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-md-6 col-sm-6 col-xxl-2  col-md-4 col-lg-2 col-12 footer-links">
                  <h4>About Unique World</h4>
                  <ul>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/about-us"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/about-us"
                      >
                        Why Choose Us?
                      </a>
                    </li>
                    <li>
                      <a
                        style={{ color: "#000", textDecoration: "none" }}
                        href="https://www.uniqueworldjobs.com/index.php/for-candidates"
                      >
                        For Candidates
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="col-md-6 col-sm-6 col-xxl-2 col-md-4 col-lg-1  col-12 footer-links">
                  {/* <div className="mb-3">
                    <h4>All Jobs</h4>
                    <ul>
                      <li>
                        <a
                          style={{ color: "#000", textDecoration: "none" }}
                          href="https://www.uniqueworldjobs.com/index.php/job-by-categories"
                        >
                          Jobs by category
                        </a>
                      </li>
                      <li>
                        <a
                          style={{ color: "#000", textDecoration: "none" }}
                          href="https://www.uniqueworldjobs.com/index.php/job/job-by-location"
                        >
                          Jobs in location
                        </a>
                      </li>
                    </ul>
                  </div> */}
                  <h4>Policies</h4>
                  <ul>
                    <li>
                      <Link
                        style={{ color: "#000", textDecoration: "none" }}
                        // href="https://www.uniqueworldjobs.com/index.php/policy"
                        to="/policy"
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ color: "#000", textDecoration: "none" }}
                        // href="https://merchant.razorpay.com/policy/Mmsgd2PcyVAKFU/terms"
                        to="/terms"
                      >
                        Terms and condition
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ color: "#000", textDecoration: "none" }}
                        // href="https://merchant.razorpay.com/policy/Mmsgd2PcyVAKFU/refund"
                        to="refund"
                      >
                        Cancelation and refund policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ color: "#000", textDecoration: "none" }}
                        // href="https://merchant.razorpay.com/policy/Mmsgd2PcyVAKFU/shipping"
                        to="shipping"
                      >
                        Shipping And Delivery policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ color: "#000", textDecoration: "none" }}
                        // href="https://merchant.razorpay.com/policy/Mmsgd2PcyVAKFU/contact_us"
                        to="contact_us"
                      >
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="row copyright">
            <div
              className="col-12 col-md-10 col-xxl-11"
              style={{ color: "#000" }}
            >
              All Rights Reserved
            </div>
            <div
              className="col-12 col-md-2 col-xxl-1"
              style={{ wordSpacing: "12px" }}
            >
              <BsWhatsapp fill="#000" /> <BsFacebook fill="#000" />{" "}
              <BsTwitter fill="#000" /> <BsLinkedin fill="#000" />
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}

export default Policy