// import React from 'react'

// const Payment = () => {

//     function onBuyClicked() {
//         if (!window.PaymentRequest) {
//           console.log('Web payments are not supported in this browser.');
//           return;
//         }
      
//         // Create supported payment method.
//         const supportedInstruments = [
//           {
//             supportedMethods: ['https://tez.google.com/pay'],
//             data: {
//               pa: 'merchant-vpa@xxx',
//               pn: 'Merchant Name',
//               tr: '1234ABCD',  // Your custom transaction reference ID
//               url: 'https://url/of/the/order/in/your/website',
//               mc: '1234', //Your merchant category code
//               tn: 'Purchase in Merchant',
//             },
//           }
//         ];
      
//         // Create order detail data.
//         const details = {
//           total: {
//             label: 'Total',
//             amount: {
//               currency: 'INR',
//               value: '10.01', // sample amount
//             },
//           },
//           displayItems: [{
//             label: 'Original Amount',
//             amount: {
//               currency: 'INR',
//               value: '10.01',
//             },
//           }],
//         };
      
//         // Create payment request object.
//         let request = null;
//         try {
//           request = new PaymentRequest(supportedInstruments, details);
//         } catch (e) {
//           console.log('Payment Request Error: ' + e.message);
//           return;
//         }
//         if (!request) {
//           console.log('Web payments are not supported in this browser.');
//           return;
//         }
      
//         var canMakePaymentPromise = checkCanMakePayment(request);
//         canMakePaymentPromise
//             .then((result) => {
//               showPaymentUI(request, result);
//             })
//             .catch((err) => {
//               console.log('Error calling checkCanMakePayment: ' + err);
//             });
//       }

//       function showPaymentUI(request, canMakePayment) {
//         if (!canMakePayment) {
//           handleNotReadyToPay();
//           return;
//         }
       
//         // Set payment timeout.
//         let paymentTimeout = window.setTimeout(function() {
//           window.clearTimeout(paymentTimeout);
//           request.abort()
//               .then(function() {
//                 console.log('Payment timed out after 20 minutes.');
//               })
//               .catch(function() {
//                 console.log('Unable to abort, user is in the process of paying.');
//               });
//         }, 20 * 60 * 1000); /* 20 minutes */
       
//         request.show()
//             .then(function(instrument) {
       
//               window.clearTimeout(paymentTimeout);
//               processResponse(instrument); // Handle response from browser.
//             })
//             .catch(function(err) {
//               console.log(err);
//             });
//        }

//        //------------//
//        const canMakePaymentCache = 'canMakePaymentCache';

// /**
//  * Check whether can make payment with Google Pay or not. It will check session storage
//  * cache first and use the cache directly if it exists. Otherwise, it will call
//  * canMakePayment method from PaymentRequest object and return the result, the
//  * result will also be stored in the session storage cache for future usage.
//  *
//  * @private
//  * @param {PaymentRequest} request The payment request object.
//  * @return {Promise} a promise containing the result of whether can make payment.
//  */
// function checkCanMakePayment(request) {
//   // Check canMakePayment cache, use cache result directly if it exists.
//   if (sessionStorage.hasOwnProperty(canMakePaymentCache)) {
//     return Promise.resolve(JSON.parse(sessionStorage[canMakePaymentCache]));
//   }

//   // If canMakePayment() isn't available, default to assume the method is
//   // supported.
//   var canMakePaymentPromise = Promise.resolve(true);

//   // Feature detect canMakePayment().
//   if (request.canMakePayment) {
//     canMakePaymentPromise = request.canMakePayment();
//   }

//   return canMakePaymentPromise
//       .then((result) => {
//         // Store the result in cache for future usage.
//         sessionStorage[canMakePaymentCache] = result;
//         return result;
//       })
//       .catch((err) => {
//         console.log('Error calling canMakePayment: ' + err);
//       });
// }

// //process response
// function processResponse(instrument) {
//     var instrumentString = instrumentToJsonString(instrument);
//     console.log(instrumentString);
   
//     fetch('/buy', {
//       method: 'POST',
//       headers: new Headers({'Content-Type': 'application/json'}),
//       body: instrumentString,
//     })
//         .then(function(buyResult) {
//           if (buyResult.ok) {
//             return buyResult.json();
//           }
//           console.log('Error sending instrument to server.');
//         })
//         .then(function(buyResultJson) {
//           completePayment(instrument, buyResultJson.status, buyResultJson.message);
   
//         })
//         .catch(function(err) {
//           console.log('Unable to process payment. ' + err);
//         });
//    }

//    //utiltiy methods
//    function handleNotReadyToPay() {
//     alert('Google Pay is not ready to pay.');
//   }

//   function completePayment(instrument, result, msg) {
//     instrument.complete(result)
//         .then(function() {
//           console.log('Payment succeeds.');
//           console.log(msg);
//         })
//         .catch(function(err) {
//           console.log(err);
//         });
//    }

//     return (
//         <div style={{display:"flex"}}>
//            <button style={{justifyContent:"center", position:'relative', top:'100px'}}
//            onClick={onBuyClicked}>Pay Now</button> 
//         </div>
//     )
// }

// export default Payment
