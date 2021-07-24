import React from 'react'

const Gpay = () => {

  //check user readiness
  const canMakePaymentCache = 'canMakePaymentCache';

  function checkCanMakePayment(request) {
    // Check canMakePayment cache, use cache result directly if it exists.
    if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
      return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
    }
  
    // If canMakePayment() isn't available, default to assume the method is
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

 

function onBuyClicked() {
  if (!window.PaymentRequest) {
    console.log('Web payments are not supported in this browser.');
    return;
  }

  // Create supported payment method.
  const supportedInstruments = [
    {
      supportedMethods: ['https://tez.google.com/pay'],
      data: {
        pa: 'kashid.akshay138@oksbi', //BCR2DN6TZ76K7GKI
        pn: 'demo',
        tr: '15634ABCD',  // Your custom transaction reference ID
        url: 'https://https://nifty-nightingale-bdf053.netlify.app/order/buy',
        mc: '1234', //Your merchant category code
        tn: 'Purchase in Merchant',
      },
    },

    
      
    {
      supportedMethods: 'basic-card',
      data: {
        supportedNetworks: [
          'visa', 'mastercard'
        ]
      }
    }
  ];

  // Create order detail data.
  const details = {
    total: {
      label: 'Total',
      amount: {
        currency: 'INR',
        value: '1.01', // sample amount
      },
    },
    displayItems: [{
      label: 'Original Amount',
      amount: {
        currency: 'INR',
        value: '1.01',
      },
    }],
  };

  // Create payment request object.
  let request = null;
  try {
    request = new PaymentRequest(supportedInstruments, details);
  } catch (e) {
    console.log('Payment Request Error: ' + e.message);
    return;
  }
  if (!request) {
    console.log('Web payments are not supported in this browser.');
    return;
  }

  var canMakePaymentPromise = checkCanMakePayment(request);
  canMakePaymentPromise
      .then((result) => {
        showPaymentUI(request, result);
      })
      .catch((err) => {
        console.log('Error calling checkCanMakePayment: ' + err);
      });
}

//show payment UI
function showPaymentUI(request, canMakePayment) {
  // if (!canMakePayment) {
  //   handleNotReadyToPay();
  //   return;
  // }

  let paymentTimeout = window.setTimeout(function() {
    window.clearTimeout(paymentTimeout);
    request.abort()
        .then(function() {
          console.log('Payment timed out after 20 minutes.');
        })
        .catch(function() {
          console.log('Unable to abort, user is in the process of paying.');
        });
  }, 20 * 60 * 1000);

  //displays UI for payment
  request.show()
  .then(function(instrument) {

    window.clearTimeout(paymentTimeout);
    processResponse(instrument); // Handle response from browser.
  })
  .catch(function(err) {
    console.log(err);
  });
}

function processResponse(instrument) {
  var instrumentString = instrumentToJsonString(instrument);
  console.log(instrumentString);
 
  fetch('/buy', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: instrumentString,
  })
      .then(function(buyResult) {
        if (buyResult.ok) {
          return buyResult.json();
        }
        console.log('Error sending instrument to server.');
      })
      .then(function(buyResultJson) {
        completePayment(instrument, buyResultJson.status, buyResultJson.message);
 
      })
      .catch(function(err) {
        console.log('Unable to process payment. ' + err);
      });
      // buyResult.json();
      // completePayment(instrument, "success", "payment done");
 }

 //complete payment
 function completePayment(instrument, result, msg) {
  instrument.complete(result)
      .then(function() {
        console.log('Payment succeeds.');
        console.log(msg);
      })
      .catch(function(err) {
        console.log(err);
      });
 }

 function handleNotReadyToPay() {
  alert('Google Pay is not ready to pay.');
}


//instrument to json string
// function paymentResponseToJsonString(paymentResponse) {
//   // PaymentResponse is an interface, JSON.stringify works only on dictionaries.
//   var paymentResponseDictionary = {
//     methodName:paymentResponse.methodName,
//     details:paymentResponse.details,
//     shippingAddress: addressToJsonString(paymentResponse.shippingAddress),
//     shippingOption: paymentResponse.shippingOption,
//     payerName: paymentResponse.payerName,
//     payerPhone: paymentResponse.payerPhone,
//     payerEmail: paymentResponse.payerEmail,
//   };
//   return JSON.stringify(paymentResponseDictionary, undefined, 2);
// }

//instrument to json string
function instrumentToJsonString(instrument){
  return JSON.stringify(instrument)
}

//address to json string
// function addressToJsonString(address){
//   return JSON.stringify(address)
// }
  return (

    <div>
      <button onClick={onBuyClicked}>Pay Now</button>
    </div>
  )
}

export default Gpay
