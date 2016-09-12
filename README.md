# node-gigya

A simple Node.js wrapper for the Gigya REST API. Based on the official Gigya Server Side SDKs


## Dependencies

* **node-fetch** - ^1.6.0
* **qs** - ^6.2.1


## Installation

via npm:

`npm install node-gigya`


## Usage

### .request(method, params)

The `request` method that takes an endpoint string and an object with request parameters. A predefined list of endpoints have also been mapped to the instance and are bound to the `request` method (see the white list below.)


```javascript
const Gigya = require('node-gigya');

const myGigya = new Gigya(myAPIKey, mySecretKey);

// get a user's account info:
const req = myGigya.request('accounts.getAccountInfo', { uid: 'useridhere' });
// OR by using the mapped method..
// const req = myGigya.accounts.getAccountInfo({ uid: 'useridhere' });

req.then(
	response => {
		// response is the json response object from the api
	},
	err => {
		// err.response contains the original json response object returned by the api.
		// err.status is the error code of the json response..
		// e.g., "errorCode": 401002, err.status will be 401
	}
);
```

## SigUtils

Included static utility methods for calculating and validating signatures in accordance with Gigya's [Security Guidelines](http://developers.gigya.com/display/GD/Security+Guidelines)

```javascript
const SigUtils = require('node-gigya').SigUtils;
```

### SigUtils.validateUserSignature(UID, timestamp, secret, signature)

Utilitiy method for validating a user signature, pass in the UID, signatureTimesatmp, site secret key, and the UIDSignature. Returns true or false.

### SigUtils.calcSignature(baseString, key)

Utility method for creating a Base64 encoded signature. Pass in a base string and the site secret key. User signatures use a base string in the format of *%TIMESTAMP%*_*%UID%*. Returns Base64 encoded signature.


## Whitelist of API endpoints

See [Gigya's REST API docs](http://developers.gigya.com/display/GD/REST+API) for a list of all current endpoints and their required parameters. This list has been maintained as of September 2016, so some endpoints may have been deprecated since.

* accounts.deleteAccount
* accounts.deleteScreenSet
* accounts.exchangeUIDSignature
* accounts.finalizeRegistration
* accounts.getAccountInfo
* accounts.getConflictingAccount
* accounts.getCounters
* accounts.getPolicies
* accounts.getRegisteredCounters
* accounts.getSchema
* accounts.getScreenSets
* accounts.importProfilePhoto
* accounts.incrementCounters
* accounts.initRegistration
* accounts.isAvailableLoginID
* accounts.linkAccounts
* accounts.login
* accounts.logout
* accounts.notifyLogin
* accounts.publishProfilePhoto
* accounts.register
* accounts.registerCounters
* accounts.resendVerificationCode
* accounts.resetPassword
* accounts.search
* accounts.setAccountInfo
* accounts.setPolicies
* accounts.setProfilePhoto
* accounts.setSchema
* accounts.setScreenSet
* ds.delete
* ds.get
* ds.getSchema
* ds.search
* ds.setSchema
* ds.store
* socialize.checkin
* socialize.deleteAccount
* socialize.delUserSettings
* socialize.exchangeUIDSignature
* socialize.exportUsers
* socialize.facebookGraphOperation
* socialize.getAlbums
* socialize.getContacts
* socialize.getFeed
* socialize.getFriendsInfo
* socialize.getPhotos
* socialize.getPlaces
* socialize.getRawData
* socialize.getReactionsCount
* socialize.getSessionInfo
* socialize.getTopShares
* socialize.getUserInfo
* socialize.getUserSettings
* socialize.importIdentities
* socialize.incrementReactionsCount
* socialize.logout
* socialize.notifyLogin
* socialize.notifyRegistration
* socialize.publishUserAction
* socialize.removeConnection
* socialize.sendNotification
* socialize.setStatus
* socialize.setUID
* socialize.setUserInfo
* socialize.setUserSettings
* socialize.shortenURL
