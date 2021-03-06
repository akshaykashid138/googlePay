// /**
//  * Define the version of the Google Pay API referenced when creating your
//  * configuration
//  *
//  * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|apiVersion in PaymentDataRequest}
//  */
//  const baseRequest = {
//     apiVersion: 2,
//     apiVersionMinor: 0
//   };
  
//   /**
//    * Card networks supported by your site and your gateway
//    *
//    * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
//    * @todo confirm card networks supported by your site and gateway
//    */
//   const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];
  
//   /**
//    * Card authentication methods supported by your site and your gateway
//    *
//    * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
//    * @todo confirm your processor supports Android device tokens for your
//    * supported card networks
//    */
//   const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];
  
//   /**
//    * Identify your gateway and your site's gateway merchant identifier
//    *
//    * The Google Pay API response will return an encrypted payment method capable
//    * of being charged by a supported gateway after payer authorization
//    *
//    * @todo check with your gateway on the parameters to pass
//    * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#gateway|PaymentMethodTokenizationSpecification}
//    */
//   const tokenizationSpecification = {
//     type: 'PAYMENT_GATEWAY',
//     parameters: {
//       'gateway': 'example',
//       'gatewayMerchantId': 'exampleGatewayMerchantId'
//     }
//   };
  
//   /**
//    * Describe your site's support for the CARD payment method and its required
//    * fields
//    *
//    * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
//    */
//   const baseCardPaymentMethod = {
//     type: 'CARD',
//     parameters: {
//       allowedAuthMethods: allowedCardAuthMethods,
//       allowedCardNetworks: allowedCardNetworks
//     }
//   };
  
//   /**
//    * Describe your site's support for the CARD payment method including optional
//    * fields
//    *
//    * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#CardParameters|CardParameters}
//    */
//   const cardPaymentMethod = Object.assign(
//     {},
//     baseCardPaymentMethod,
//     {
//       tokenizationSpecification: tokenizationSpecification
//     }
//   );
  
//   /**
//    * An initialized google.payments.api.PaymentsClient object or null if not yet set
//    *
//    * @see {@link getGooglePaymentsClient}
//    */
//   let paymentsClient = null;
  
//   /**
//    * Configure your site's support for payment methods supported by the Google Pay
//    * API.
//    *
//    * Each member of allowedPaymentMethods should contain only the required fields,
//    * allowing reuse of this base request when determining a viewer's ability
//    * to pay and later requesting a supported payment method
//    *
//    * @returns {object} Google Pay API version, payment methods supported by the site
//    */
//   function getGoogleIsReadyToPayRequest() {
//     return Object.assign(
//         {},
//         baseRequest,
//         {
//           allowedPaymentMethods: [baseCardPaymentMethod]
//         }
//     );
//   }
  
//   /**
//    * Configure support for the Google Pay API
//    *
//    * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest|PaymentDataRequest}
//    * @returns {object} PaymentDataRequest fields
//    */
//   function getGooglePaymentDataRequest() {
//     const paymentDataRequest = Object.assign({}, baseRequest);
//     paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
//     paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
//     paymentDataRequest.merchantInfo = {
//       // @todo a merchant ID is available for a production environment after approval by Google
//       // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
//       // merchantId: '01234567890123456789',
//       merchantName: 'Example Merchant'
//     };
//     return paymentDataRequest;
//   }
  
//   /**
//    * Return an active PaymentsClient or initialize
//    *
//    * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
//    * @returns {google.payments.api.PaymentsClient} Google Pay API client
//    */
//   function getGooglePaymentsClient() {
//     if ( paymentsClient === null ) {
//       paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
//     }
//     return paymentsClient;
//   }
  
//   /**
//    * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
//    *
//    * Display a Google Pay payment button after confirmation of the viewer's
//    * ability to pay.
//    */
//   function onGooglePayLoaded() {
//     const paymentsClient = getGooglePaymentsClient();
//     paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
//         .then(function(response) {
//           if (response.result) {
//             addGooglePayButton();
//             // @todo prefetch payment data to improve performance after confirming site functionality
//             // prefetchGooglePaymentData();
//           }
//         })
//         .catch(function(err) {
//           // show error in developer console for debugging
//           console.error(err);
//         });
//   }
  
//   /**
//    * Add a Google Pay purchase button alongside an existing checkout button
//    *
//    * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#ButtonOptions|Button options}
//    * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
//    */
//   function addGooglePayButton() {
//     const paymentsClient = getGooglePaymentsClient();
//     const button =
//         paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
//     document.getElementById('container').appendChild(button);
//   }
  
//   /**
//    * Provide Google Pay API with a payment amount, currency, and amount status
//    *
//    * @see {@link https://developers.google.com/pay/api/web/reference/request-objects#TransactionInfo|TransactionInfo}
//    * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
//    */
//   function getGoogleTransactionInfo() {
//     return {
//       countryCode: 'US',
//       currencyCode: 'USD',
//       totalPriceStatus: 'FINAL',
//       // set to cart total
//       totalPrice: '1.00'
//     };
//   }
  
//   /**
//    * Prefetch payment data to improve performance
//    *
//    * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
//    */
//   function prefetchGooglePaymentData() {
//     const paymentDataRequest = getGooglePaymentDataRequest();
//     // transactionInfo must be set but does not affect cache
//     paymentDataRequest.transactionInfo = {
//       totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
//       currencyCode: 'USD'
//     };
//     const paymentsClient = getGooglePaymentsClient();
//     paymentsClient.prefetchPaymentData(paymentDataRequest);
//   }
  
//   /**
//    * Show Google Pay payment sheet when Google Pay payment button is clicked
//    */
//   function onGooglePaymentButtonClicked() {
//     const paymentDataRequest = getGooglePaymentDataRequest();
//     paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
  
//     const paymentsClient = getGooglePaymentsClient();
//     paymentsClient.loadPaymentData(paymentDataRequest)
//         .then(function(paymentData) {
//           // handle the response
//           processPayment(paymentData);
//         })
//         .catch(function(err) {
//           // show error in developer console for debugging
//           console.error(err);
//         });
//   }
  
//   /**
//    * Process payment data returned by the Google Pay API
//    *
//    * @param {object} paymentData response from Google Pay API after user approves payment
//    * @see {@link https://developers.google.com/pay/api/web/reference/response-objects#PaymentData|PaymentData object reference}
//    */
//   function processPayment(paymentData) {
//     // show returned data in developer console for debugging
//       console.log(paymentData);
//     // @todo pass payment token to your gateway to process payment
//     paymentToken = paymentData.paymentMethodData.tokenizationData.token;
//   }



const canMakePaymentCache = 'canMakePaymentCache';

/**
 * Read data for supported instruments from input from.
 */
function readSupportedInstruments() {
  let formValue = {};
  formValue['pa'] = document.getElementById('pa').value;
  formValue['pn'] = document.getElementById('pn').value;
  formValue['tn'] = document.getElementById('tn').value;
  formValue['mc'] = document.getElementById('mc').value;
  formValue['tr'] = document.getElementById('tr').value;
  formValue['tid'] = document.getElementById('tid').value;
  formValue['url'] = document.getElementById('url').value;
  return formValue;
}

/**
 * Read the amount from input form.
 */
function readAmount() {
  return document.getElementById('amount').value;
}

/**
 * Launches payment request.
 */
function onBuyClicked() {
  if (!window.PaymentRequest) {
    console.log('Web payments are not supported in this browser.');
    return;
  }

  let formValue = readSupportedInstruments();

  const supportedInstruments = [
    {
      supportedMethods: ['https://pwp-server.appspot.com/pay-dev'],
      data: formValue,
    },
    {
      supportedMethods: ['https://tez.google.com/pay'],
      data: formValue,
    },
  ];

  const details = {
    total: {
      label: 'Total',
      amount: {
        currency: 'INR',
        value: readAmount(),
      },
    },
    displayItems: [
      {
        label: 'Original amount',
        amount: {
          currency: 'INR',
          value: readAmount(),
        },
      },
    ],
  };

  const options = {
    requestShipping: true,
    requestPayerName: true,
    requestPayerPhone: true,
    requestPayerEmail: true,
    shippingType: 'shipping',
  };

  let request = null;
  try {
    request = new PaymentRequest(supportedInstruments, details, options);
  } catch (e) {
    console.log('Payment Request Error: ' + e.message);
    return;
  }
  if (!request) {
    console.log('Web payments are not supported in this browser.');
    return;
  }

  request.addEventListener('shippingaddresschange', function(evt) {
    evt.updateWith(new Promise(function(resolve) {
      fetch('/ship', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: addressToJsonString(request.shippingAddress),
        credentials: 'include',
      })
          .then(function(options) {
            if (options.ok) {
              return options.json();
            }
            console.log('Unable to calculate shipping options.');
          })
          .then(function(optionsJson) {
            if (optionsJson.status === 'success') {
              updateShipping(details, optionsJson.shippingOptions, resolve);
            } else {
              console.log('Unable to calculate shipping options.');
            }
          })
          .catch(function(err) {
            console.log('Unable to calculate shipping options. ' + err);
          });
    }));
  });

  request.addEventListener('shippingoptionchange', function(evt) {
    evt.updateWith(new Promise(function(resolve) {
      for (let i in details.shippingOptions) {
        if ({}.hasOwnProperty.call(details.shippingOptions, i)) {
          details.shippingOptions[i].selected =
              (details.shippingOptions[i].id === request.shippingOption);
        }
      }

      updateShipping(details, details.shippingOptions, resolve);
    }));
  });

  var canMakePaymentPromise = checkCanMakePayment(request);
  canMakePaymentPromise
      .then((result) => {
        showPaymentUI(request, result);
      })
      .catch((err) => {
        console.log('Error calling checkCanMakePayment: ' + err);
      });
}

/**
 * Checks whether can make a payment with Tez on this device. It checks the
 * session storage cache first and uses the cached information if it exists.
 * Otherwise, it calls canMakePayment method from the Payment Request object and
 * returns the result. The result is also stored in the session storage cache
 * for future use.
 *
 * @private
 * @param {PaymentRequest} request The payment request object.
 * @return {Promise} a promise containing the result of whether can make payment.
 */
function checkCanMakePayment(request) {
  // Checks canMakePayment cache, and use the cache result if it exists.
  if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
    return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
  }

  // If canMakePayment() isn't available, default to assuming that the method is
  // supported.
  var canMakePaymentPromise = Promise.resolve(true);

  // Feature detect canMakePayment().
  if (request.canMakePayment) {
    canMakePaymentPromise = request.canMakePayment();
  }

  return canMakePaymentPromise
      .then((result) => {
        // Store the result in cache for future usage.
        sessionStorage[canMakePaymentCache] = result;
        return result;
      })
      .catch((err) => {
        console.log('Error calling canMakePayment: ' + err);
      });
}

/**
 * Show the payment request UI.
 *
 * @private
 * @param {PaymentRequest} request The payment request object.
 * @param {Promise} canMakePayment The promise for whether can make payment.
 */
function showPaymentUI(request, canMakePayment) {
  // Redirect to play store if can't make payment.
  if (!canMakePayment) {
    redirectToPlayStore();
    return;
  }

  // Set payment timeout.
  let paymentTimeout = window.setTimeout(function() {
    window.clearTimeout(paymentTimeout);
    request.abort()
        .then(function() {
          console.log('Payment timed out after 20 minutes.');
        })
        .catch(function() {
          console.log('Unable to abort, user is in the process of paying.');
        });
  }, 20 * 60 * 1000); /* 20 minutes */

  request.show()
      .then(function(instrument) {
        window.clearTimeout(paymentTimeout);
        processResponse(instrument);  // Handle response from browser.
      })
      .catch(function(err) {
        console.log(err);
      });
}

/**
 * Process the response from browser.
 *
 * @private
 * @param {PaymentResponse} instrument The payment instrument that was authed.
 */
function processResponse(instrument) {
  var instrumentString = instrumentToJsonString(instrument);
  console.log(instrumentString);

  fetch('/buy', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: instrumentString,
    credentials: 'include',
  })
      .then(function(buyResult) {
        if (buyResult.ok) {
          return buyResult.json();
        }
        console.log('Error sending instrument to server.');
      })
      .then(function(buyResultJson) {
        completePayment(
            instrument, buyResultJson.status, buyResultJson.message);
      })
      .catch(function(err) {
        console.log('Unable to process payment. ' + err);
      });
}

/**
 * Notify browser that the instrument authorization has completed.
 *
 * @private
 * @param {PaymentResponse} instrument The payment instrument that was authed.
 * @param {string} result Whether the auth was successful. Should be either
 * 'success' or 'fail'.
 * @param {string} msg The message to log in console.
 */
function completePayment(instrument, result, msg) {
  instrument.complete(result)
      .then(function() {
        console.log('Payment completes.');
        console.log(msg);
        document.getElementById('inputSection').style.display = 'none'
        document.getElementById('outputSection').style.display = 'block'
        document.getElementById('response').innerHTML =
            JSON.stringify(instrument, undefined, 2);
      })
      .catch(function(err) {
        console.log(err);
      });
}

/** Redirect to PlayStore. */
function redirectToPlayStore() {
  if (confirm('Tez not installed, go to play store and install?')) {
    window.location.href =
        'https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user.alpha'
  };
}

/**
 * Converts the shipping address into a JSON string.
 *
 * @private
 * @param {PaymentAddress} address The address to convert.
 * @return {string} The string representation of the address.
 */
function addressToJsonString(address) {
  var addressDictionary = address.toJSON ? address.toJSON() : {
    recipient: address.recipient,
    organization: address.organization,
    addressLine: address.addressLine,
    dependentLocality: address.dependentLocality,
    city: address.city,
    region: address.region,
    postalCode: address.postalCode,
    sortingCode: address.sortingCode,
    country: address.country,
    phone: address.phone,
  };
  return JSON.stringify(addressDictionary, undefined, 2);
}

/**
 * Converts the payment instrument into a JSON string.
 *
 * @private
 * @param {PaymentResponse} instrument The instrument to convert.
 * @return {string} The string representation of the instrument.
 */
function instrumentToJsonString(instrument) {
  // PaymentResponse is an interface, JSON.stringify works only on dictionaries.
  var instrumentDictionary = {
    methodName: instrument.methodName,
    details: instrument.details,
    shippingAddress: addressToJsonString(instrument.shippingAddress),
    shippingOption: instrument.shippingOption,
    payerName: instrument.payerName,
    payerPhone: instrument.payerPhone,
    payerEmail: instrument.payerEmail,
  };
  return JSON.stringify(instrumentDictionary, undefined, 2);
}

/**
 * Update order details with shipping information.
 *
 * @private
 * @param {PaymentDetails} details The details for payment.
 * @param {Array} shippingOptions The shipping options.
 * @param {function} callback The callback to invoke.
 */
function updateShipping(details, shippingOptions, callback) {
  let selectedShippingOption;
  for (let i in shippingOptions) {
    if (shippingOptions[i].selected) {
      selectedShippingOption = shippingOptions[i];
    }
  }

  var total = parseFloat(readAmount());
  if (selectedShippingOption) {
    let shippingPrice = Number(selectedShippingOption.amount.value);
    total = total + shippingPrice;
  }

  details.shippingOptions = shippingOptions;
  details.total.amount.value = total.toFixed(2);
  if (selectedShippingOption) {
    details.displayItems.splice(
        1, details.displayItems.length == 1 ? 0 : 1, selectedShippingOption);
  }

  callback(details);
}