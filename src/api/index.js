const mode = 'local'
export const WEB_URL = mode === 'local' ? "http://192.168.56.1:5001" : "https://server.automanage.in"

export const auth_token = {
    headers: {
        Authorization: localStorage.getItem('rclt')
    }
}