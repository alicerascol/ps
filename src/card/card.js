// 0. Get originKey
getOriginKey().then(originKey => {
    // 1. Create an instance of AdyenCheckout
    const checkout = new AdyenCheckout({
        environment: 'test',
        originKey: originKey // Mandatory. originKey from Costumer Area
    });

    // 2. Create and mount the Component
    const card = checkout
        .create('card', {
            // Optional Configuration
            hasHolderName: true,

            // Optional. Customize the look and feel of the payment form
            // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
            styles: {},

            // Optional. Define custom placeholders for the Card fields
            // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
            placeholders: {
                // encryptedCardNumber: '9999 9999 9999 9999',
                // encryptedExpiryDate: '01/22',
                // encryptedSecurityCode : '123'
            },

            // Optionally show a Pay Button
            showPayButton: true,

            // Events
            onSubmit: (state, component) => {
                // if (state.isValid) {
                //     makePayment(card.data);
                // }

                if (state.isValid) {
                    const encryptedExpiryMonth = state.data.paymentMethod.encryptedExpiryMonth;
                    const encryptedExpiryYear = state.data.paymentMethod.encryptedExpiryYear;
                    const encryptedSecurityCode = state.data.paymentMethod.encryptedSecurityCode;
                    const encryptedCardNumber = state.data.paymentMethod.encryptedCardNumber;
                    const browserInfo = navigator.userAgent;

                    var paymentDraft = {
                        amountPlanned: {
                          currencyCode: "EUR",
                          centAmount:10000
                        },
                        paymentMethodInfo: {
                          method: "creditCard",
                          paymentInterface:	"ctp-adyen-integration"
                        },
                        custom: {
                          type: {
                              typeId: "type",
                              id: "d656ae17-3aff-4cf5-ac1d-185bff25ea81"
                          },
                          fields: {
                              countryCode: "GB",
                              merchantReference: "cart-id_1",
                              holderName: "sa",
                                encryptedCardNumber: encryptedCardNumber,
                                encryptedExpiryMonth: encryptedExpiryMonth,
                                encryptedExpiryYear: encryptedExpiryYear,
                                encryptedSecurityCode: encryptedSecurityCode,
                                returnUrl:"https://google.com"
                          }
                       }, 
                       transactions: [{
                           type: "Charge",
                           state: "Initial",
                           amount:{
                                centAmount:10000,
                                currencyCode:"EUR"
                            }
                       }]
                    };
                    
                    makeCtAdyenPayment(paymentDraft);
                }
            },
            onChange: (state, component) => {
                // state.data;
                // state.isValid;

                updateStateContainer(state); // Demo purposes only
            }
        })
        .mount('#card-container');
});
