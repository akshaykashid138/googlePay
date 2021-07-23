import React from 'react'
import GooglePayButton from '@google-pay/button-react'
const GooglePay = () => {
   
    return (
        <GooglePayButton
        environment="TEST"
        paymentRequest={{
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD', 'VISA'],
              },
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                  gateway: 'example',
                  gatewayMerchantId: 'exampleGatewayMerchantId',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: '12345678901234567890', //console merchant id
            merchantName: 'Demo Merchant', //name of business
            
          },
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: '1.00',
            currencyCode: 'USD',
            countryCode: 'US',
          },
          callbackIntents:['PAYMENT_AUTHORIZATION']
        }}
        onLoadPaymentData={paymentRequest => {
          console.log('load payment data', paymentRequest);
        }}
        onPaymentAuthorized={paymentData=>{
            console.log("payment authorized success",paymentData)
            return {transactionState: 'SUCCESS'}
        }}
        buttonType='short'
        buttonColor='white'
      />    
    )
}

export default GooglePay
