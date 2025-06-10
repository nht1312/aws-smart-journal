export const LOGIN_PAGE = "https://ap-southeast-20jp1e88vh.auth.ap-southeast-2.amazoncognito.com/login?client_id=6vcoj0co2du99jr2ea6p2mfheg&response_type=code&scope=email+openid+phone&redirect_uri=https://staging.d2offfgi7j3soh.amplifyapp.com/";
//export const LOGIN_PAGE = "https://ap-southeast-20jp1e88vh.auth.ap-southeast-2.amazoncognito.com/login?client_id=6vcoj0co2du99jr2ea6p2mfheg&response_type=code&scope=email+openid+phone&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2F";
export const LOGOUT_URL = "https://ap-southeast-20jp1e88vh.auth.ap-southeast-2.amazoncognito.com/logout?client_id=6vcoj0co2du99jr2ea6p2mfheg&logout_uri=https://staging.d2offfgi7j3soh.amplifyapp.com/";
//export const LOGOUT_URL = "https://ap-southeast-20jp1e88vh.auth.ap-southeast-2.amazoncognito.com/logout?client_id=6vcoj0co2du99jr2ea6p2mfheg&logout_uri=http%3A%2F%2Flocalhost%3A5173%2F";

export const menuItems = [
  {
    tag: "home",
    label: "Trang chủ", 
    href: "/",
    isHandleOnClick: false
  },
  {
    tag:  "createNew",
    label: "Viết vài dòng", 
    href: "/new-diary",
    isHandleOnClick: false
  },
  {
    tag: "log out",
    label: "Đăng xuất", 
    href: "#",
    isHandleOnClick: true
  },
];

