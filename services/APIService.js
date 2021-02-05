import axios from 'axios'
import AuthService from './AuthService'

class APIService {

    authService = new AuthService()

    constructor(baseURL = process.env.baseUrl) {
        this.baseURL = baseURL;
        this.headers = this.authService.getCookie();
        this.instance = axios.create({
            baseURL: this.baseURL,
            headers: this.headers
        })
    }

    getBaseUrl() {
        return this.baseURL
    }


    _Post(api, body) {
        return new Promise((resolve, reject) => {
            const url = this.baseURL
            if (api == '/admin' || api == '/admin/login') {
                axios.post(`${url}${api}`, body)
                    .then((response) => {
                        const { headers, data } = response
                        this.authService.createCookie(headers["refresh-token"], headers["x-access-token"])
                        resolve(response)
                    }, (err) => {
                        console.log(err)
                        reject(err)
                    })
            }
            axios.post(`${url}${api}`, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.headers.acess,
                    'refresh-token': this.headers.refresh
                }
            })
                .then((response) => {
                    if (api == '/admin/logout')
                        this.authService.removeCookie()
                    resolve(response)
                }, (err) => {
                    reject(err)
                })
        })
    }

    _Get(api, { refreshToken, accessToken }) {
        return new Promise((resolve, reject) => {
            const url = this.baseURL
            axios.get(`${url}${api}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': accessToken,
                    'refresh-token': refreshToken
                }
            })
                .then((response) => {
                    resolve(response.data)
                }, (err) => {
                    console.log(err)
                    reject(err)
                })
        })
    }

    _Delete(api) {
        return new Promise((resolve, reject) => {
            const url = this.baseURL
            axios.delete(`${url}${api}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.headers.acess,
                    'refresh-token': this.headers.refresh
                }
            })
                .then((response) => {
                    resolve(response)
                }, (err) => {
                    reject(err)
                })
        })
    }

    _Patch(api, items) {
        return new Promise((resolve, reject) => {
            const url = this.baseURL
            axios.patch(`${url}${api}`, items, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': this.headers.acess,
                    'refresh-token': this.headers.refresh
                }
            })
                .then((response) => {
                    resolve(response)
                }, (err) => {
                    reject(err)
                })
        })
    }
}


export default APIService;





// _Post(api, body) {
    //     return new Promise((resolve, reject) => {
    //         const url = this.baseURL
    //         axios.post(`${url}${api}`, body).
    //             then((response) => {
    //                 const { headers, data } = response
    //                 if (headers.authorization != 'true') {
    //                     this.authService.removeCookie()
    //                     resolve({})
    //                 }
    //                 if (headers['refresh-token'] && headers['x-access-token']) {
    //                     this.authService.createCookie(headers["refresh-token"], headers["x-access-token"])
    //                 }
    //                 resolve(response)
    //             }).catch((err) => {
    //                 reject(err)

    //             })
    //     })

    // }

