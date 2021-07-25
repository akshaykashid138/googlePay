import React from 'react'

const Final = () => {

    function payClicked(){
       

        {
        
              // googleMerchantId should be set. This ID is globally unique across all Google Pay merchants.
              merchantInfo: {
                    googleMerchantId: "BREKJWNFNFLS"
              }
              userInfo: {
                    // Phone no. of the payer in E.164 format
                    phoneNumber: "+919876543210"
               }
               merchantTransactionDetails: {
                    // Transaction ID from Google Pay partner. This must be unique for every transaction done by the partner and should be in accordance with the syntax agreed upon with the merchant PSP.
                    transactionId: "transactionId"
                    // Amount to be paid by user
                    amountPayable: {
                          // The 3-letter currency code defined in ISO 4217.
                          currencyCode: "INR"
                          // The whole units of the amount.
                          // For example if currencyCode is "INR", then 1 unit is one rupee.
                          units: 100
                          // Number of nano (10^-9) units of the amount.
                          nanos: 0
                    }
                    // Description for the transaction.
                    description: "Sample description"
                    // UPI Payment Details of the merchant.
                   upiPaymentDetails: {
                         // VPA where the payment needs to be done. Need to be specified only if it is different from the default VPA.
                         vpa: "abc@xyz"
                   }
                   // Details about GST.
                   gst: {
                         // Merchant GSTIN (Goods and Services Tax Identification Number).
                         gstin: "29ABCDE1234F2Z5";
                         gstBreakUp: {
                               // Goods and Services Tax.
                               Totalgst: {
                                     // The 3-letter currency code defined in ISO 4217.
                                     currencyCode: "INR"
                                     // The whole units of the amount.
                                     // For example if currencyCode is "INR", then 1 unit is one rupee.
                                     units: 10
                                     // Number of nano (10^-9) units of the amount.
                                     nanos: 0
                               }
                               // Central Goods and Services Tax.
                               cgst: {
                                     // The 3-letter currency code defined in ISO 4217.
                                     currencyCode: "INR"
                                     // The whole units of the amount.
                                     // For example if currencyCode is "INR", then 1 unit is one rupee.
                                     units: 5
                                     // Number of nano (10^-9) units of the amount.
                                     nanos: 0
                               }
                               // State Goods and Services Tax.
                               sgst: {
                                     // The 3-letter currency code defined in ISO 4217.
                                     currencyCode:  "INR"
                                     // The whole units of the amount.
                                     // For example if currencyCode is "INR", then 1 unit is one rupee.
                                     units: 3
                                     // Number of nano (10^-9) units of the amount.
                                     nanos: 0
                               }
                               // Integrated Goods and Services Tax.
                               igst: {
                                     // The 3-letter currency code defined in ISO 4217.
                                     currencyCode: "INR"
                                     // The whole units of the amount.
                                     // For example if currencyCode is "INR", then 1 unit is one rupee.
                                     unit: 1
                                     // Number of nano (10^-9) units of the amount.
                                     nanos: 0
                               }
                               // GST compensation cess.
                               cess: {
                                     // The 3-letter currency code defined in ISO 4217.
                                     currencyCode: "INR"
                                     // The whole units of the amount.
                                     // For example if currencyCode is "INR", then 1 unit is one rupee.
                                     units: 1
                                     // Number of nano (10^-9) units of the amount.
                                     nanos: 0
                               }
                       }
                   }
                   invoice: {
                       invoiceNumber: "Invoice456"
                       // The time of invoice in RFC 3339 format. Eg, 2017-02-15T16:20:30+05:30 for IST timezone; 2017-02-15T10:50:30Z for UTC.
                       invoiceTime: "2017-02-15T10:50:30Z"
                   }
             }
        
             // The time at which the request expires in RFC 3339 format. Eg, 2017-02-15T16:20:30+05:30 for IST timezone; 2017-02-15T10:50:30Z for UTC.
             expiryTime: "2017-02-15T10:50:30Z"
             // The platform at which the request is originating
             originatingPlatform: "ANDROID_APP"
        }
    }
    

    return (
        <div>
            <button onClick={payClicked}>Pay Now</button>
        </div>
    )
}

export default Final
