import React, { useState, useEffect, useRef } from "react";
import logo from "../../../assets/images/logo/unique-logo.png";
import classNames from "classnames";
import Marquee from "react-fast-marquee";
// import poster1 from '../../../assets/images/landingpage/Mask Group 1.png'
import placementService from "../../../assets/images/landingpage/placementService.svg";
import resumeBuilding from "../../../assets/images/landingpage/resumeBuilding.svg";
import recruitmentService from "../../../assets/images/landingpage/recruitmentService.svg";
import hrAudit from "../../../assets/images/landingpage/hrAudit.svg";
import historyImage from "../../../assets/images/landingpage/history.avif";
import missionImage from "../../../assets/images/landingpage/mission.avif";
import visionImage from "../../../assets/images/landingpage/vision.avif";
import achievementImage from "../../../assets/images/landingpage/achivement.jpg";
import whatsappicon from "../../../assets/images/icons/icons8-whatsapp.svg";
import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { BsWhatsapp, BsFacebook, BsTwitter, BsLinkedin } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import AOS from "aos";
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper";
import CountUp from "react-countup";
import "swiper/swiper-bundle.min.css";
import employers from "../../../assets/images/landingpage/employment.png";
import employment from "../../../assets/images/landingpage/recruitment.png";
import "aos/dist/aos.css";
import style from "./index.module.scss";
// import './index.module.scss'
import "./footer.scss";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { getstatistics } from "../../../apis/statistics/statistics";
import { Avatar, Popover } from "antd";
import { Radio } from "antd";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Navbar,
  Row,
} from "reactstrap";
import bgimage from "../../../assets/images/landingpage/clientbg.png";
import { Check } from "react-feather";
// import { tostifySuccess } from "../../../components/Tostify";
// import imgURL from "../../../assets/images/landingpage/intro1.png";
const LandingPage = () => {
  const [numberofemp, setnumberofemp] = useState(null);
  useEffect(() => {
    async function fetchData() {
      let numberof = await getstatistics();
      setnumberofemp(numberof);
    }
    fetchData();
  }, []);
  const history = useHistory();
  const [activeServiceTab, setActiveServiceTab] = useState("1");
  const [tabs, setTabs] = useState("history");

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [selectWtspMsg, setSelectWtspMsg] = useState(0);

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
      mirror: false,
    });
  }, []);

  function importAll(r) {
    return r.keys().map(r);
  }

  // const images = importAll(require.context('../../../assets/images/Clients/', false, /\.(png|jpe?g|svg)$/));
  const images = importAll(
    require.context(
      "../../../assets/images/Clients",
      false,
      /\.(png|jpe?g|svg)$/
    )
  );

  const content = (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          position: "absolute",
          top: "0",
          width: "100%",
          left: "0",
          padding: "10px 15px",
          backgroundColor: "#323D76",
          color: "#fff",
          borderRadius: "8px",
        }}
      >
        <img
          src={logo}
          style={{ borderRadius: "50%", backgroundColor: "#fff" }}
          height={40}
          width={40}
        />
        <span style={{ fontSize: "17px", fontWeight: "600" }}>
          Unique World Jobs
        </span>
      </div>
      <div
        style={{
          marginTop: "80px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          height: "13rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            cursor: "default",
          }}
          onClick={() => setSelectWtspMsg(1)}
        >
          <div
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border:
                selectWtspMsg == 1 ? " 1px solid #323D76" : "1px solid #ccc",
              backgroundColor: selectWtspMsg == 1 ? "#323D76" : "transparent",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#fff",
              }}
            ></div>
          </div>
          <div>I want to apply for job!</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            cursor: "default",
          }}
          onClick={() => setSelectWtspMsg(2)}
        >
          <div
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border:
                selectWtspMsg == 2 ? " 1px solid #323D76" : "1px solid #ccc",
              backgroundColor: selectWtspMsg == 2 ? "#323D76" : "transparent",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#fff",
              }}
            ></div>
          </div>
          <div>I want to Hire Staff!</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            cursor: "default",
          }}
          onClick={() => setSelectWtspMsg(3)}
        >
          <div
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border:
                selectWtspMsg == 3 ? " 1px solid #323D76" : "1px solid #ccc",
              backgroundColor: selectWtspMsg == 3 ? "#323D76" : "transparent",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#fff",
              }}
            ></div>
          </div>
          <div>I want to make my Resume Professional!</div>
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Button
          style={{
            width: "145px",
            backgroundColor: "#323D76",
            color: "white",
          }}
          className="add-new-user"
          color="default"
          disabled={selectWtspMsg == 0 ? true : false}
          onClick={() => {
            if (selectWtspMsg != 0) {
              window.open(
                selectWtspMsg == 1
                  ? `https://wa.me/+919974877260?text=I want to apply for job!`
                  : selectWtspMsg == 2
                    ? `https://wa.me/+919974877260?text=I want to Hire Staff!`
                    : selectWtspMsg == 3
                      ? `https://wa.me/+919974877260?text=I want to make my Resume Professional!`
                      : "https://wa.me/+919974877260"
              );
            }
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );

  const aboutUsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#about-us") {
      aboutUsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  const handleAboutUsClick = () => {
    aboutUsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const contactUsRef = useRef(null);

  useEffect(() => {
    if (location.hash === "#contact-us") {
      contactUsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  const handleContactUsClick = () => {
    contactUsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    for (const key in formData) {
      if (!formData[key].trim()) {
        errors[key] = "Please enter " + key;
      }
    }
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      console.log("Form submitted:", formData);
      setMsg("Your message has been sent. Thank you!");
      // tostifySuccess();
      setFormData({
        name: "",
        email: "",
        number: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <>
      <div id={style.enquireNowBtnDiv}>
        <Popover content={content} placement="topLeft" trigger="click">
          <img src={whatsappicon} />
        </Popover>
      </div>
      <div className={style["landing-page-wrapper"]}>
        <div className={classNames("container", style["container"])}>
          <section
            className={style["header"]}
            data-aos="fade-top"
            data-aos-delay="200"
          >
            <Row>
              <Col
                md={12}
                className="d-flex justify-content-center align-items-center"
              >
                <div>
                  {" "}
                  <img src={logo} alt="logo" className="img-fluid" />
                </div>
                <div style={{ marginLeft: "auto" }}>
                  {" "}
                  <Navbar expand="md">
                    <Nav className="ml-auto gap-2" navbar>
                      <NavItem>
                        <NavLink onClick={handleAboutUsClick} href="#">
                          About Us
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink href="/plan-pricing" target="_blank">
                          Pricing
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink onClick={handleContactUsClick} href="#">
                          Contact Us
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink onClick={() => history.push("/login")} href="#">
                          Login
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Navbar>
                </div>
              </Col>

              {/* <Col
                md={3}
                className="d-flex justify-content-end align-items-center"
              ></Col> */}
            </Row>
          </section>

          {/* <section className={style["landing-intro"]}>
            <div className="h-100">
              <div
                className={classNames(style["landing-intro-title"])}
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <ul>
                  <li>
                    {" "}
                    <h3>
                      Bridging the gap An Easy to Use End-to-End Hiring Platform{" "}
                    </h3>
                    <br />
                  </li>
                  <li>
                    <h4>
                      Now move to complete automation of your recruitment
                      process, right from requisition, to match making, to
                      sourcing, to screening and shortlisting, to interview
                      management, to offer. That’s all, you get complete control
                      & visibility on our recruitment CRM tool.
                    </h4>
                  </li>
                  <li style={{ marginTop: 25, justifyContent: "flex-start" }}>
                    <button
                      className={classNames(style["btn"], "w-100")}
                      onClick={() =>
                      (window.location.href =
                        "https://portal.uniqueworldjobs.com/client-registration")
                      }
                      data-aos="fade-in"
                      data-aos-delay="200"
                    >
                      Try for Free
                    </button>
                  </li>
                </ul>
              </div>{" "}
              <div
                className={classNames(style["landing-intro-poster"])}
                data-aos="fade-left"
                data-aos-delay="200"
              ></div>
            </div>
          </section> */}
          <section className={style["landing-intro"]}>
            <div className="row h-100">
              <div
                className={classNames(
                  "col-12 col-md-5",
                  style["landing-intro-title"]
                )}
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <ul>
                  <li>
                    {" "}
                    <h3>
                      Bridging the gap An Easy to Use End-to-End Hiring Platform{" "}
                    </h3>
                    <br />
                  </li>
                  <li>
                    <h4>
                      Now move to complete automation of your recruitment
                      process, right from requisition, to match making, to
                      sourcing, to screening and shortlisting, to interview
                      management, to offer. That’s all, you get complete control
                      & visibility on our recruitment CRM tool.
                    </h4>
                  </li>
                  <li
                    style={{
                      marginTop: 25,
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    <button
                      className={classNames(style["btn"], "w-100")}
                      onClick={() => {
                        // const currentUrl = window.origin;
                        // const newUrl = `${currentUrl}/client-registration`;
                        // window.open(newUrl);
                        history.push("/client-registration");
                      }}
                      data-aos="fade-in"
                      data-aos-delay="200"
                    >
                      Try for Free
                    </button>
                  </li>
                </ul>
              </div>

              <div
                className={classNames(
                  "col-12 col-md-7",
                  style["landing-intro-poster"]
                )}
                data-aos="fade-left"
                data-aos-delay="200"
              >
                {/* <img
                  src={imgURL}
                  className={classNames(style["responsive-image"])}
                ></img> */}
              </div>
            </div>
          </section>
        </div>
        <section className={style["landing-looking-job-staff-wrapper"]}>
          <div className={classNames("container", style["container"], "h-100")}>
            <div className="row h-100">
              <div
                className={classNames("col-12 col-md-6", style["looking-item"])}
              >
                <div
                  className={style["landing-joblooking-poster"]}
                  data-aos="zoom-in"
                  data-aos-delay="200"
                ></div>
                <button
                  className={classNames(style["btn-job"], "w-100")}
                  onClick={() => history.push(`/uniqueworld/candidate/apply`)}
                  data-aos="fade-in"
                  data-aos-delay="200"
                >
                  Looking For Job
                </button>
              </div>
              <div
                className={classNames("col-12 col-md-6", style["looking-item"])}
              >
                <div
                  className={style["landing-jobseeker-poster"]}
                  data-aos="zoom-in"
                  data-aos-delay="200"
                ></div>
                <button
                  className={classNames(style["btn-job"], "w-100")}
                  onClick={() =>
                    history.push("/uniqueworld/client-registration")
                  }
                  data-aos="fade-in"
                  data-aos-delay="200"
                >
                  Looking For Staff
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className={style["landing-aboutus"]}>
          <div
            className={classNames("container", style["container"], "h-100")}
            ref={aboutUsRef}
          >
            <h1 data-aos="fade-down" data-aos-delay="200">
              About us
            </h1>
            <ul
              className={style["landing-about-wrapper-lists"]}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <li>
                <button
                  className={classNames(style["btn-job"], {
                    [style["active"]]: tabs === "history",
                  })}
                  onClick={() => setTabs("history")}
                >
                  History
                </button>
              </li>
              <li>
                <button
                  className={classNames(style["btn-job"], {
                    [style["active"]]: tabs === "mission",
                  })}
                  onClick={() => setTabs("mission")}
                >
                  Mission
                </button>
              </li>
              <li>
                <button
                  className={classNames(style["btn-job"], {
                    [style["active"]]: tabs === "vision",
                  })}
                  onClick={() => setTabs("vision")}
                >
                  Vision
                </button>
              </li>
              {/* <li>
                            <button className={classNames(style['btn-job'], { [style['active']]: tabs === "values" })} onClick={() => setTabs("values")}>Values</button>
                        </li> */}
              <li>
                <button
                  className={classNames(style["btn-job"], {
                    [style["active"]]: tabs === "achivement",
                  })}
                  onClick={() => setTabs("achivement")}
                >
                  Achivement
                </button>
              </li>
            </ul>
            <div className="row">
              <div
                className="col-12 col-md-6"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                <div className="d-flex align-items-center justify-content-center h-100 w-100">
                  {tabs === "history" ? (
                    <h4 className={classNames(style["item-text"])}>
                      A leading India’s{" "}
                      <b>free Job Placement services Since 2010</b>
                      &nbsp; dealing with all the corporate Sector
                      <br />
                      <br />
                      <b>Dhaval Gandhi</b> &nbsp; as a founder and CEO of the
                      Unique World Company, have been in this industry more than
                      ten years and love every minute of it.
                    </h4>
                  ) : null}
                  {tabs === "mission" ? (
                    <h4 className={style["item-text"]}>
                      Our Mission to develop{" "}
                      <b>
                        {" "}
                        long-term and strategic with our clients, and help them
                        to transform today’s challenges{" "}
                      </b>
                      into tomorrow’s successes.
                    </h4>
                  ) : null}
                  {tabs === "vision" ? (
                    <h4 className={classNames(style["item-text"])}>
                      Our Vision is to become one of the{" "}
                      <b> leading human resources consulting firm</b> operating
                      globally by maintaining our uncompromising principles and
                      create value for all our stakeholders
                    </h4>
                  ) : null}
                  {tabs === "values" ? (
                    <h4 className={classNames(style["item-text"])}>
                      <h4>Integrity</h4>
                      We embrace and uphold the highest standards of personal
                      and professional ethics, honesty and trust.
                      <br />
                      <br />
                      <h4>Responsibility</h4>
                      We are responsible to fulfil our commitments to our
                      people, clients, partners and all our stakeholders with a
                      clear understanding of the urgency and accountability
                      inherent in those commitments.
                      <br />
                      <br />
                      <h4>Passion for Excellence</h4>
                      We promise that we will deliver exceptional business
                      results while making a positive contribution to our
                      client’s organization.
                      <br />
                      <br />
                      <h4>Empowerment</h4>
                      We are empowered to deliver operational excellence through
                      innovation and leadership at all levels.
                      <br />
                      <br />
                      <h4>Collaboration</h4>
                      We work as a team and share knowledge for continuous
                      improvement, learning and innovation.
                      <br />
                      <br />
                      <h4>Respect</h4>
                      We treat everyone with uncompromising respect, civility
                      and fairness. And we always welcome diversity and
                      differences of opinion.
                      <br />
                    </h4>
                  ) : null}
                  {tabs === "achivement" ? (
                    <h4 className={classNames(style["item-text"])}>
                      <ul>
                        <li>
                          {" "}
                          More then <b>1K + Candidates </b> Placed in Last 3
                          Years &<b> 500 + leading corporate tie up </b> with
                          companies
                        </li>
                        <li>
                          <b> 500 + Professional Resume Buildup </b> Services
                          Delivered to Job Seekers
                        </li>
                        <li>
                          <b>10K + Candidates </b> are connected on one place
                          with Social Media
                        </li>
                        <li>
                          <b>
                            50 + HR Documentation, Consulting & Implementation
                            to MSME
                          </b>
                        </li>
                        <li>
                          Always be open for{" "}
                          <b> free career guidelines to employment</b>
                        </li>
                      </ul>
                    </h4>
                  ) : null}
                </div>
              </div>
              <div
                className="col-12 col-md-6 text-center"
                data-aos="fade-left"
                data-aos-delay="200"
              >
                {tabs === "history" && (
                  <img
                    className={classNames("img-fluid", style["img-poster"])}
                    src={historyImage}
                    alt="img"
                  />
                )}
                {tabs === "mission" && (
                  <img
                    className={classNames("img-fluid", style["img-poster"])}
                    src={missionImage}
                    alt="img"
                  />
                )}{" "}
                {tabs === "vision" && (
                  <img
                    className={classNames("img-fluid", style["img-poster"])}
                    src={visionImage}
                    alt="img"
                  />
                )}{" "}
                {tabs === "achivement" && (
                  <img
                    className={classNames("img-fluid", style["img-poster"])}
                    src={achievementImage}
                    alt="img"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        <section className={style["landing-aboutus"]}>
          <div className={classNames("container", style["container"], "h-100")}>
            <h1 data-aos="fade-down" data-aos-delay="200">
              Services
            </h1>
            <ul
              className={style["landing-services-wrapper-lists"]}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <li>
                <button
                  className={classNames(style["btn-job"], {
                    [style["active"]]: activeServiceTab === "1",
                  })}
                  onClick={() => setActiveServiceTab("1")}
                >
                  For Candidates
                </button>
              </li>
              <li>
                <button
                  className={classNames(style["btn-job"], {
                    [style["active"]]: activeServiceTab === "2",
                  })}
                  onClick={() => setActiveServiceTab("2")}
                >
                  For Companies
                </button>
              </li>
            </ul>
            <div className="row">
              {activeServiceTab === "1" ? (
                <>
                  <div
                    className={classNames(style["row-col"], "col-12 col-md-6")}
                    data-aos="fade-right"
                    data-aos-delay="200"
                  >
                    <div className={classNames(style["card"], "mx-auto")}>
                      <div
                        className={style["card-heading"]}
                        style={{ backgroundImage: `url(${placementService})` }}
                      ></div>
                      <div className={style["card-content"]}>
                        <h3>Placement Service</h3>
                        <h5>
                          We are dealing in all the fields i.e.{" "}
                          <b>
                            {" "}
                            Manufacturing, Automobiles, Industries, Engineering,
                            Information Technology, Retails, Chemical industry,
                            Pharmaceutical, Service industry, Telecom, and many
                            more.
                          </b>
                          <br /> <br />
                        </h5>
                        <h5>
                          We are Expertise in Recruitment Profile of{" "}
                          <b>
                            {" "}
                            HR, Back Office, Admin, Sales, Marketing,
                            Engineering, Purchase, E-Commerce, Customer Support,
                            Hardware Networking, Accounts & many more
                          </b>
                        </h5>{" "}
                        <br />
                        <b>
                          Enroll Now!
                          <a
                            style={{ color: "green" }}
                            onClick={() =>
                              window.open("https://wa.me/+919974877260")
                            }
                          >
                            {" "}
                            +91 9974877260
                          </a>
                        </b>
                      </div>
                    </div>
                  </div>
                  <div
                    className={classNames(style["row-col"], "col-12 col-md-6")}
                    data-aos="fade-left"
                    data-aos-delay="200"
                  >
                    <div className={classNames(style["card"], "mx-auto")}>
                      <div
                        className={style["card-heading"]}
                        style={{ backgroundImage: `url(${resumeBuilding})` }}
                      ></div>
                      <div className={style["card-content"]}>
                        <h3>Resume building</h3>
                        <h5>
                          <b>
                            "Standout from the crowd with our professionally
                            written resume by expert"
                          </b>
                          <br />
                          <br />
                          Resume that highlights your strengths and showcase
                          your experience
                          <br />
                          <br />
                          <b>
                            {" "}
                            Professional Resume <br />
                            Affordable Price <br />
                            Pre-Screening before building <br />
                            Free update <br />
                            Free cover letter <br />
                            Approach CV on websites <br />
                            Time to time follow ups <br />
                            Setup LinkedIN profile <br />
                            200 Corporate HR's Mail <br />
                          </b>
                          <br />
                          <br />
                          Know more on making an impactful resume and using it's
                          real power of your resume in your job search!
                          <br />
                          <br />
                          <b>
                            Enroll Now!
                            <a
                              style={{ color: "green" }}
                              onClick={() =>
                                window.open("https://wa.me/+918141548260")
                              }
                            >
                              {" "}
                              +91 8141548260{" "}
                            </a>
                          </b>
                        </h5>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={classNames(style["row-col"], "col-12 col-md-6")}
                    data-aos="fade-right"
                    data-aos-delay="200"
                  >
                    <div className={classNames(style["card"], "mx-auto")}>
                      <div
                        className={style["card-heading"]}
                        style={{
                          backgroundImage: `url(${recruitmentService})`,
                        }}
                      ></div>
                      <div className={style["card-content"]}>
                        <h3>Recruitment service</h3>
                        <h5>
                          We assist companies to hire competent employees. By
                          ensuring smooth and hassle-free hiring process, we
                          optimize companies’ time so that recruitment process
                          doesn’t affect their business.
                        </h5>
                        <br />{" "}
                        <b>
                          Enroll Now!
                          <a
                            style={{ color: "green" }}
                            onClick={() =>
                              window.open("https://wa.me/+919974877260")
                            }
                          >
                            {" "}
                            +91 9974877260
                          </a>
                        </b>
                      </div>
                    </div>
                  </div>
                  <div
                    className={classNames(style["row-col"], "col-12 col-md-6")}
                    data-aos="fade-left"
                    data-aos-delay="200"
                  >
                    <div className={classNames(style["card"], "mx-auto")}>
                      <div
                        className={style["card-heading"]}
                        style={{ backgroundImage: `url(${hrAudit})` }}
                      ></div>
                      <div className={style["card-content"]}>
                        <h3>HR Audit and Documentation</h3>
                        <h5>
                          We frame personalized corporate documents for
                          companies, who are willing to add professionalism to
                          their firm. Companies face various difficulties; such
                          as lack of information, lack of HR expertise, etc. in
                          framing their documents.
                        </h5>
                        <br />{" "}
                        <b>
                          Enroll Now!
                          <a
                            style={{ color: "green" }}
                            onClick={() =>
                              window.open("https://wa.me/+919974877260")
                            }
                          >
                            {" "}
                            +91 9974877260
                          </a>
                        </b>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className={style["landing-aboutus"]}>
          <div className={classNames("container", style["container"], "h-100")}>
            <h1 data-aos="fade-down" data-aos-delay="200">
              Testimonials
            </h1>

            <div className="row">
              <Swiper
                spaceBetween={10}
                effect={"fade"}
                navigation={true}
                pagination={{
                  clickable: true,
                }}
                modules={[EffectFade, Navigation, Pagination]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames("container", style["container"])}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/NXHK5ftzUig"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames("container", style["container"])}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/orD0Xp_ADYI"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames("container", style["container"])}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/kIqwafWDQ3w?start=35"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames("container", style["container"])}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/9Db9nZtp1fc"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames("container", style["container"])}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <iframe
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/KDh0HonbupQ"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
              {/* </Marquee> */}
            </div>
            <div className="row" style={{ marginTop: 20 }}>
              <Swiper
                data-aos="fade-up"
                data-aos-delay="200"
                loop={true}
                autoplay={{ delay: 2000 }}
                modules={[Autoplay]}
                spaceBetween={10}
                slidesPerView={screenSize?.width > 520 ? 3 : 1}
                parallax={true}
                resizeObserver={true}
                pagination
              >
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames(
                        style["card-testimonials"],
                        "mx-auto"
                      )}
                    >
                      <div className="d-flex justify-content-center">
                        <div className={style["card-heading"]}>AS</div>
                      </div>
                      <div className={style["card-content"]}>
                        <p style={{ fontSize: "13px", color: "#fff" }}>
                          <i>
                            "Such a good experience with Unique world placement
                            Specially thanx dhaval sir"
                          </i>
                        </p>
                        <h3>- AKANKSHA SINGH</h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames(
                        style["card-testimonials"],
                        "mx-auto"
                      )}
                    >
                      <div className="d-flex justify-content-center">
                        <div className={style["card-heading"]}>DG</div>
                      </div>
                      <div className={style["card-content"]}>
                        <p style={{ fontSize: "13px", color: "#fff" }}>
                          <i>
                            "Working with Unique World is the best Experience I
                            have ever had with any consultant they are so fast
                            that you don’t have to look for anything entire team
                            is very supportive would definitely recommend them
                            to work for any recruitment position so happy with
                            their services"
                          </i>
                        </p>
                        <h3>- Disha Goswami</h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames(
                        style["card-testimonials"],
                        "mx-auto"
                      )}
                    >
                      <div className="d-flex justify-content-center">
                        <div className={style["card-heading"]}>PS</div>
                      </div>
                      <div className={style["card-content"]}>
                        <p style={{ fontSize: "13px", color: "#fff" }}>
                          <i>
                            "Unique World Placement is best service provider we
                            have hired staff and very satisfied with service"
                          </i>
                        </p>
                        <h3>- Pankaj Soni</h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames(
                        style["card-testimonials"],
                        "mx-auto"
                      )}
                    >
                      <div className="d-flex justify-content-center">
                        <div className={style["card-heading"]}>RP</div>
                      </div>
                      <div className={style["card-content"]}>
                        <p style={{ fontSize: "13px", color: "#fff" }}>
                          <i>
                            "Great recruiter for job seekers. Professional and
                            responsible. And the best thing is unlike other
                            consultant services they don't charge any amount for
                            that."
                          </i>
                        </p>
                        <h3>- Rahul Parmar</h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames(
                        style["card-testimonials"],
                        "mx-auto"
                      )}
                    >
                      <div className="d-flex justify-content-center">
                        <div className={style["card-heading"]}>RY</div>
                      </div>
                      <div className={style["card-content"]}>
                        <p style={{ fontSize: "13px", color: "#fff" }}>
                          <i>
                            "Unique world has helped me a lot in finding a great
                            job opportunity. I am really satisfied with their
                            work. Toral thank you so much... 😊"
                          </i>
                        </p>
                        <h3>- Rachna Yash</h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    style={{ margin: "20px 0" }}
                  >
                    <div
                      className={classNames(
                        style["card-testimonials"],
                        "mx-auto"
                      )}
                    >
                      <div className="d-flex justify-content-center">
                        <div className={style["card-heading"]}>CP</div>
                      </div>
                      <div className={style["card-content"]}>
                        <p style={{ fontSize: "13px", color: "#fff" }}>
                          <i>
                            "I got my first job through this agency and I’m
                            thankful to Dhaval Gandhi as he has been very
                            cooperative and straightforward. Happy with the
                            experience! 😊"
                          </i>
                        </p>
                        <h3>- Chanda Patel</h3>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              </Swiper>
              {/* </Marquee> */}
            </div>
          </div>
        </section>
        <section className={style["landing-aboutus"]}>
          <div className={classNames("container", style["container"], "h-100")}>
            <h1 data-aos="fade-down" data-aos-delay="200">
              Top Companies
            </h1>

            <div className="row">
              <div className="col-12">
                <Marquee className="marquee-slider">
                  {images?.map((ele) => (
                    <img
                      src={ele}
                      alt="client-photo"
                      style={{ height: "200px", margin: "0px 7px 0px 7px" }}
                    />
                  ))}
                </Marquee>
              </div>
            </div>
          </div>
        </section>
        <section className={style["landing-aboutus"]}>
          <div
            className={classNames("container", style["container"], "h-100")}
            ref={contactUsRef}
          >
            <h1 data-aos="fade-down" data-aos-delay="200">
              Contact Us
            </h1>
            <div data-aos="fade-down" data-aos-delay="200">
              <Form>
                <Row>
                  <Col md={6} xs={12}>
                    <FormGroup>
                      <Label for="name">Name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        invalid={errors.name && true}
                      />
                      {errors.name && (
                        <div className="error-message" style={{ color: "red" }}>
                          {errors.name}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6} xs={12}>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        invalid={errors.email && true}
                      />
                      {errors.email && (
                        <div className="error-message" style={{ color: "red" }}>
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} xs={12}>
                    <FormGroup>
                      <Label for="subject">Mobile Number</Label>
                      <Input
                        type="text"
                        name="number"
                        id="number"
                        placeholder="Enter Mobile Number"
                        value={formData.number}
                        onChange={handleChange}
                        invalid={errors.number && true}
                      />
                      {errors.number && (
                        <div className="error-message" style={{ color: "red" }}>
                          {errors.number}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md={6} xs={12}>
                    <FormGroup>
                      <Label for="subject">Subject</Label>
                      <Input
                        type="text"
                        name="subject"
                        id="subject"
                        placeholder="Enter subject"
                        value={formData.subject}
                        onChange={handleChange}
                        invalid={errors.subject && true}
                      />
                      {errors.subject && (
                        <div className="error-message" style={{ color: "red" }}>
                          {errors.subject}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} xs={12}>
                    <FormGroup>
                      <Label for="message">Message</Label>
                      <Input
                        type="textarea"
                        name="message"
                        id="message"
                        placeholder="Enter your message"
                        value={formData.message}
                        onChange={handleChange}
                        invalid={errors.message && true}
                      />
                      {errors.message && (
                        <div className="error-message" style={{ color: "red" }}>
                          {errors.message}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="d-flex justify-content-center">
                    {/* <Button color="primary">Submit</Button> */}
                    <button
                      className={classNames(style["btn-submit"])}
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </Col>
                  {msg && (
                    <div
                      className="error-message d-flex justify-content-center  align-items-center"
                      style={{ color: "green" }}
                    >
                      <Avatar
                        color="light-success"
                        icon={<Check />}
                        className="me-2"
                        style={{ backgroundColor: "green" }}
                      />

                      {msg}
                    </div>
                  )}
                </Row>
              </Form>
            </div>
          </div>
        </section>

        <section className={style["landing-looking-job-staff-wrapper"]}>
          <div className={classNames("container", style["container"], "h-100")}>
            <div className="row h-100">
              <div
                className={classNames("col-12 col-md-6", style["looking-item"])}
              >
                <div
                  className={classNames(style["fun-fact"])}
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={employment}
                    alt="logo"
                    className="img-fluid"
                    style={{ maxHeight: "130px" }}
                  />
                  <div className={classNames(style["info"])}>
                    <CountUp
                      start={0}
                      end={numberofemp?.employee[0]?.count}
                      duration={5}
                      separator=","
                      style={{ fontSize: 48, color: "black" }}
                    />
                    <p style={{ fontSize: 25, marginTop: 10 }}>Employees</p>
                  </div>
                </div>
              </div>
              <div
                className={classNames("col-12 col-md-6", style["looking-item"])}
              >
                <div
                  className={classNames(style["fun-fact"])}
                  style={{
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "center",
                  }}
                >
                  <div className={classNames(style["info"])}>
                    <CountUp
                      start={0}
                      end={numberofemp?.employer[0]?.count}
                      duration={5}
                      separator=","
                      style={{ fontSize: 48, color: "black" }}
                    />
                    <p style={{ fontSize: 25, marginTop: 10 }}>Employers</p>
                  </div>
                  <img
                    src={employers}
                    alt="logo"
                    className="img-fluid"
                    style={{ maxHeight: "130px", transform: "scaleX(-1)" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div>
            <a
              href="https://www.my-co.app/enquiry/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 d-flex justify-content-center mb-1"
            >
              <img
                style={{ maxWidth: "50%" }}
                src={bgimage}
                alt="Clickable Image"
              />
            </a>
          </div>
        </section>
        <section>
          <div id="landingFooter" className="landingFooter">
            <div
              className="footer-top"
              style={{ borderBottom: "1px solid #000" }}
            >
              <div className={classNames("container", style["container"])}>
                <div className="row row-adjustment">
                  <div
                    className="col-xxl-2 col-md-12 col-lg-3 footer-info"
                    style={{
                      display: "flex",

                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <a href="#" className="logo d-flex align-items-center">
                        <img src={logo} alt="Uniqueworld Logo" />
                      </a>
                    </div>

                    <div> </div>

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
                          Address: 335-336, Fortune High Street, Green City
                          Road, Near Madhuvan Circle, Adajan, Surat - 395009{" "}
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
                          to="/policy"
                        // href="https://www.uniqueworldjobs.com/index.php/"
                        // onClick={() => history.push("/policy")}
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          style={{ color: "#000", textDecoration: "none" }}
                          // href="https://merchant.razorpay.com/policy/Mmsgd2PcyVAKFU/terms"
                          to="terms"
                        >
                          Terms and condition
                        </Link>
                      </li>
                      <li>
                        <Link
                          style={{ color: "#000", textDecoration: "none" }}
                          // href="https://merchant.razorpay.com/policy/Mmsgd2PcyVAKFU/refund"
                          to="/refund"
                        >
                          Cancelation and refund policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          style={{ color: "#000", textDecoration: "none" }}
                          // href="https://merchant.razorpay.com/policy/Mmsgd2PcyVAKFU/shipping"
                          to="/shipping"
                        >
                          Shipping And Delivery policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          style={{ color: "#000", textDecoration: "none" }}
                          // href="https://merchant.razorpay.com/policy/Mmsgd2PcyVAKFU/contact_us"
                          to="/contact_us"
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
                © 2023 All rights reserved by{" "}
                <strong style={{ color: "#323D76" }}>
                  {" "}
                  Unique world Jobs.
                </strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
