import Cookies from 'js-cookie';
import { getCookie } from 'react-use-cookie';


class AuthService {
   constructor() { }

   createCookie = (a, b) => {
      Cookies.set("refreshToken", a)
      Cookies.set("accessToken", b)
   }

   getCookie = () => {
      const accessToken = getCookie('accessToken');
      const refreshToken = getCookie('refreshToken');
      return { "acess": accessToken, "refresh": refreshToken }
   }


   removeCookie = () => {
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
   }

}

export default AuthService;



















// const createCookies = (refreshToken, accessToken) => {
//     Cookies.set("refreshToken", refreshToken)
//     Cookies.set("accessToken", accessToken)
// }

// const getCookies = () =>{
//     const accessToken = getCookie('accessToken');
//     const refreshToken = getCookie('refreshToken');
//     return {accessToken, refreshToken}
// }

// const delCookies = () =>{
//     Cookies.remove('accessToken')
//     Cookies.remove('refreshToken')
// } 



// module.exports = {
//     createCookies,
//     getCookies,
//     delCookies,
// }