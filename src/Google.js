import React,{useState,useEffect} from 'react'

const Google = () => {

    const [btn, setBtn]=useState('')

    const baseRequest = {
        apiVersion: 2,
        apiVersionMinor: 0
      };

      const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];

      const allowedCardAuthMethods = ["PAN_ONLY", "CRYPTOGRAM_3DS"];

      const tokenizationSpecification = {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          'gateway': 'example',
          'gatewayMerchantId': 'exampleGatewayMerchantId'
        }
      };    

      const baseCardPaymentMethod = {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: allowedCardAuthMethods,
          allowedCardNetworks: allowedCardNetworks
        }
      };

      const cardPaymentMethod = Object.assign(
        {},
        baseCardPaymentMethod,
        {
          tokenizationSpecification: tokenizationSpecification
        }
      );

      let paymentsClient = null;

      function getGoogleIsReadyToPayRequest() {
        return Object.assign(
            {},
            baseRequest,
            {
              allowedPaymentMethods: [baseCardPaymentMethod]
            }
        );
      }

      function getGooglePaymentDataRequest() {
        const paymentDataRequest = Object.assign({}, baseRequest);
        paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
        paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
        paymentDataRequest.merchantInfo = {
          // @todo a merchant ID is available for a production environment after approval by Google
          // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
          // merchantId: '01234567890123456789',
          merchantName: 'Example Merchant'
        };
        return paymentDataRequest;
      }

      function getGooglePaymentsClient() {
        if ( paymentsClient === null ) {
          paymentsClient = new google.payments.api.PaymentsClient({environment: 'TEST'});
        }
        return paymentsClient;
      }

      function onGooglePayLoaded() {
        const paymentsClient = getGooglePaymentsClient();
        paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
            .then(function(response) {
              if (response.result) {
                addGooglePayButton();
                // @todo prefetch payment data to improve performance after confirming site functionality
                // prefetchGooglePaymentData();
              }
            })
            .catch(function(err) {
              // show error in developer console for debugging
              console.error(err);
            });
      }

      function addGooglePayButton() {
        const paymentsClient = getGooglePaymentsClient();
        setBtn({btn:1})
        const button =
            paymentsClient.createButton({onClick: onGooglePaymentButtonClicked});
        document.getElementById('container').appendChild(button);
      }

      
      function getGoogleTransactionInfo() {
        return {
          countryCode: 'US',
          currencyCode: 'USD',
          totalPriceStatus: 'FINAL',
          // set to cart total
          totalPrice: '1.00'
        };
      }

      function prefetchGooglePaymentData() {
        const paymentDataRequest = getGooglePaymentDataRequest();
        // transactionInfo must be set but does not affect cache
        paymentDataRequest.transactionInfo = {
          totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
          currencyCode: 'USD'
        };
        const paymentsClient = getGooglePaymentsClient();
        paymentsClient.prefetchPaymentData(paymentDataRequest);
      }

      function onGooglePaymentButtonClicked() {
        const paymentDataRequest = getGooglePaymentDataRequest();
        paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
      
        const paymentsClient = getGooglePaymentsClient();
        paymentsClient.loadPaymentData(paymentDataRequest)
            .then(function(paymentData) {
              // handle the response
              processPayment(paymentData);
            })
            .catch(function(err) {
              // show error in developer console for debugging
              console.error(err);
            });
      }

      function processPayment(paymentData) {
        // show returned data in developer console for debugging
          console.log(paymentData);
        // @todo pass payment token to your gateway to process payment
        let paymentToken = paymentData.paymentMethodData.tokenizationData.token;
      }

      useEffect(()=>{
        const script = document.createElement("script");

        script.src = "https://pay.google.com/gp/p/js/pay.js";
        script.async = true;
    
        document.body.appendChild(script);
      })
    return (
        <div onLoad={onGooglePayLoaded} id='container'>
            {
                
                btn==1 &&
                <button onClick={onGooglePaymentButtonClicked}></button>
            }
            
        </div>
    )
}

export default Google
