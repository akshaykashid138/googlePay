import React from 'react'

const Final = () => {

    function payClicked(){
        if(window.PaymentRequest) {
            // Use Payment Request API
          } else {
            // Fallback to traditional checkout
            // window.location.href = '/checkout/traditional';
            alert("google pay not supported")
          }
    
          //payment request consturctor
          const supportedPaymentMethods = [
            {
                supportedMethods: 'https://google.com/pay',
                data: {
                  environment: 'TEST',
                  apiVersion: 1,
                  allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD'],
                  paymentMethodTokenizationParameters: {
                    tokenizationType: 'PAYMENT_GATEWAY',
                    // Check with your payment gateway on the parameters to pass.
                    parameters: {}
                  },
                  cardRequirements: {
                    allowedCardNetworks: ['AMEX', 'DISCOVER', 'MASTERCARD', 'VISA'],
                    billingAddressRequired: true,
                    billingAddressFormat: 'MIN'
                  },
                  phoneNumberRequired: true,
                  emailRequired: true,
                  shippingAddressRequired: true
                },
              }
          ];
    
          //payment details
          const paymentDetails = {
            total: {
              label: 'Total',
              amount:{
                currency: 'USD',
                value: 0
              }
            }
          };
        //   // Options isn't required.
        //   const options = {};
          
        //   new PaymentRequest(
        //     supportedPaymentMethods,
        //     paymentDetails,
        //     options
        //   );
    
        //payment request
        const request = new PaymentRequest(
            supportedPaymentMethods,
            paymentDetails
          );
          
          request.show()
    .then((paymentResponse) => {
      // Close the payment request UI.
      return paymentResponse.complete()
      .then(() => {
        // TODO: Get the payment details from paymentResponse object.
        // TODO: Process payment
      });
    })
    .catch((err) => {
      console.error('Payment Request API error: ', err);
    });
    }
    

    return (
        <div>
            <button onClick={payClicked}>Pay Now</button>
        </div>
    )
}

export default Final
