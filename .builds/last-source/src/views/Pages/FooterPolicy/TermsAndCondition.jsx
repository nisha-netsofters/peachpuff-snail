import React, { useEffect } from 'react'
import logo from "../../../assets/images/logo/unique-logo.png";
import "./Index.scss"
import style from "../LandingPage/index.module.scss";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { BsWhatsapp, BsFacebook, BsTwitter, BsLinkedin } from "react-icons/bs";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


const TermsAndCondition = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [])
  return (
    <div id='policycontainer'>
      <div id='header'>
        <img src={logo} alt="" />
      </div>
      <div id="wrapper">
        <p id='contentheader'>Terms & Conditions</p>
        <div id="contentspeader"></div>
        <p id="updated-date">Last updated on Oct 12th 2023</p>
        <p className='content-text'>The Website Owner, including subsidiaries and affiliates (“Website” or “Website Owner” or “we” or “us” or “our”) provides the information contained on the website or any of the pages comprising the website (“website”) to visitors (“visitors”) (cumulatively referred to as “you” or “your” hereinafter) subject to the terms and conditions set out in these website terms and conditions, the privacy policy and any other relevant terms and conditions, policies and notices which may be applicable to a specific section or module of the website.
        </p>
        <p className='content-text'>
          Welcome to our website. If you continue to browse and use this website you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Unique World Placement''s relationship with you in relation to this website.
        </p>
        <p className='content-text'>
          The term 'Unique World Placement' or 'us' or 'we' refers to the owner of the website whose registered/operational office is T-1 3rd Floor, Time Square building, Beside bhulkabhavan School, Adajan Surat GUJARAT 395009. The term 'you' refers to the user or viewer of our website.
        </p>

        <p className='content-text'>
          <strong>
            The use of this website is subject to the following terms of use:
          </strong>
        </p>


        <ul>
          <li className='content-text list-text'>
            The content of the pages of this website is for your general information and use only. It is subject to change without notice.
          </li>
          <li className='content-text list-text'>
            Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
          </li>
          <li className='content-text list-text'>
            Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.
          </li>
          <li className='content-text list-text'>
            This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
          </li>
          <li className='content-text list-text'>
            All trademarks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.      
           </li>
          <li className='content-text list-text'>
          Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.
          </li>
          <li className='content-text list-text'>
          From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information.      
           </li>
          <li className='content-text list-text'>
          You may not create a link to this website from another website or document without Unique World Placement’s prior written consent.           </li>
          <li className='content-text list-text'>
          Your use of this website and any dispute arising out of such use of the website is subject to the laws of India or other regulatory authority.           </li>
        </ul>

        <p className='content-text'>
          <strong>
            What we do with the information we gather
          </strong>
        </p>

        <p className='content-text'>
        We as a merchant shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time
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

export default TermsAndCondition