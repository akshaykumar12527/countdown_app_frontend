import axios from 'axios';
import { API_URL } from './constant';

function isIncognitoMode() {
  return new Promise((resolve) => {
    try {
      window.localStorage.setItem('test', 'test');
      window.localStorage.removeItem('test');
      resolve(false); // localStorage is accessible, not in incognito mode
    } catch (e) {
      resolve(true); // Unable to access localStorage, likely in incognito mode
    }
  });
}

async function generateSessionId() {
  const fingerprintData = {
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    colorDepth: window.screen.colorDepth,
    timeZoneOffset: new Date().getTimezoneOffset(),
    plugins: Array.from(navigator.plugins).map(plugin => {
      return { name: plugin.name, filename: plugin.filename };
    })
  };


  const randomValue = Math.random().toString(36).substr(2, 9);

  //private window
  const isIncognito = await isIncognitoMode();
  if(isIncognito){
    fingerprintData.randomValue = randomValue;
    fingerprintData.isPrivate = true;
  }
  // Serialize fingerprint data to JSON
  const fingerprintString = JSON.stringify(fingerprintData);

  // Hash the fingerprint string to generate a unique ID
  const sessionId = await hashCode(fingerprintString);

  return sessionId;
}

async function hashCode(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function fetchTimerHistory(sessionId) {
	try {
		const resp = await axios.get(`${API_URL}/timers`, { params: { sessionId } });
		return resp.data;
	} catch (err) {
		if (err.response) {
			return err.response.data;
		} else {
			return { error: true, message: 'Something went wrong, please try again.' };
		}
	}
}

async function createTimer(data) {
	try {
		const resp = await axios.post(`${API_URL}/timers`, { ...data });
		return resp.data;
	} catch (err) {
		if (err.response) {
			return err.response.data;
		} else {
			return { error: true, message: 'Something went wrong, please try again.' };
		}
	}
}

async function syncTimer(data) {
	try {
		const resp = await axios.put(`${API_URL}/timers`, { ...data });
		return resp.data;
	} catch (err) {
		if (err.response) {
			return err.response.data;
		} else {
			return { error: true, message: 'Something went wrong, please try again.' };
		}
	}
}

async function removeTimer(data) {
	try {
		const resp = await axios.delete(`${API_URL}/timers`, { params: {_id: data._id} });
		return resp.data;
	} catch (err) {
		if (err.response) {
			return err.response.data;
		} else {
			return { error: true, message: 'Something went wrong, please try again.' };
		}
	}
}



export { generateSessionId, fetchTimerHistory, createTimer, syncTimer, removeTimer };
