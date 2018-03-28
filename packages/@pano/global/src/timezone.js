// Store local time zone in cookie
import * as jstz from 'jstz'
import Cookies from 'js-cookie'

const tz = jstz.determine();

Cookies.set('timezone', tz.name(), {expires: 7, path: '/'});
