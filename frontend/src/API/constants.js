import axios from "axios";

const frontendPort = 2400,
    backendAddress = 'http://192.168.0.116',
    backendPort = 3400;

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

axios.defaults.headers.common['X-CSRFToken'] = csrftoken;

export const baseURL = window.location.href.includes(`:${frontendPort}`) ? `${backendAddress}:${backendPort}/` : '/'; //FIXME
