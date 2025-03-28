const dotenv = require("dotenv");
dotenv.config();
const companyInfo = {
  COMPANY_NAME: process.env.COMPANY_NAME,
  COMPANY_EMAIL: process.env.COMPANY_EMAIL,
  COMPANY_MOBILE_NO: process.env.COMPANY_MOBILE_NO,
  WEBSITE_URL: process.env.WEBSITE_URL,
  LOGO: "https://firebasestorage.googleapis.com/v0/b/website-cdb07.appspot.com/o/assets%2Flogo%2Fwhite-logo.png?alt=media&token=f67ade68-d0db-467e-82ea-ef15a6443aa1",
  INSTAGRAM:
    "https://firebasestorage.googleapis.com/v0/b/website-cdb07.appspot.com/o/assets%2Fsocial%2Finstagram-1.jpg?alt=media&token=179852af-05ac-4867-a9e1-b57f53a01a8d",
  FACEBOOK:
    "https://firebasestorage.googleapis.com/v0/b/website-cdb07.appspot.com/o/assets%2Fsocial%2Ffacebook-1.jpg?alt=media&token=63ea5cf8-f297-4f8f-b226-77e5f62f27e8",
  TEMPLATE_BG:
    "https://firebasestorage.googleapis.com/v0/b/website-cdb07.appspot.com/o/assets%2Fmail-template-bg.webp?alt=media&token=d9851d2f-bb91-4ea5-962e-0394accddd7c",
};

module.exports = companyInfo;
