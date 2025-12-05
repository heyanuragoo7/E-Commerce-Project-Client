import React from "react";
import { Link } from "react-router-dom";
import {
  faUser,
  faShoppingCart,
  faArrowUp,
  faSearch,
  faExchangeAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <footer>
      {/* Top green promo band */}
      <div className="free-shipping-band" style={{ background: '#8cc63f', color: '#fff' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="free-shipping">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                <div>
                    <strong style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 22 }}>FREE SHIPPING</strong>
                    <div className="text-sm">Offered by Online Sale — We will bring your desired Products at your house, for free!</div>
                </div>
                {/* <button className="btn">LEARN MORE</button> */}
                </div>
            </div>

          <div>
            <Link to="#" className="btn btn-learn" style={{ background: '#fff', color: '#444', padding: '10px 18px', borderRadius: 6, fontWeight:600 }}>LEARN MORE</Link>
          </div>
        </div>
      </div>

      {/* Main footer area */}
      <div className="footer-container" style={{ background: '#4b4b4b', color: '#ddd' }}>
        <div className="footer-wrap max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-4 gap-8">
            <div className="footer-column">
              <h4 className="footer-heading">CUSTOMER SERVICE</h4>
              <ul className="footer-list">
                <li><Link to="#">Specials</Link></li>
                <li><Link to="#">New products</Link></li>
                <li><Link to="#">Best sellers</Link></li>
                <li><Link to="#">Our stores</Link></li>
                <li><Link to="#">Contact us</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">INFORMATION</h4>
              <ul className="footer-list">
                <li><Link to="#">Delivery</Link></li>
                <li><Link to="#">Legal Notice</Link></li>
                <li><Link to="#">About us</Link></li>
                <li><Link to="#">Sitemap</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">MY ACCOUNT</h4>
              <ul className="footer-list">
                <li><Link to="#">My orders</Link></li>
                <li><Link to="#">My credit slips</Link></li>
                <li><Link to="#">My addresses</Link></li>
                <li><Link to="#">My personal info</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">CONTACT US</h4>
              <div className="contact-block">
                <p>prestazilla@gmail.com</p>
                <p>+38649 123 456 789 00</p>
                <p>Lorem ipsum address street no 24 b41</p>
              </div>
            </div>
          </div>

          {/* Back to top circle button positioned center-ish */}
          <div className="footer-absolute" style={{ position: 'relative' }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="back-to-top"
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '-51px',
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#8cc63f',
                border: '6px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>

          {/* Bottom copyright + social */}
          <div className="footer-bottom mt-16 pt-8 border-t" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div className="copy">© 2013 onlinestore , All Rights Reserved</div>

            <div className="social flex items-center gap-4">
              <a href="#" aria-label="facebook" className="text-white"><i className="fa fa-facebook" /></a>
              <a href="#" aria-label="twitter" className="text-white"><i className="fa fa-twitter" /></a>
              <a href="#" aria-label="rss" className="text-white"><i className="fa fa-rss" /></a>
              <a href="#" aria-label="pinterest" className="text-white"><i className="fa fa-pinterest" /></a>
              <a href="#" aria-label="google" className="text-white"><i className="fa fa-google-plus" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
