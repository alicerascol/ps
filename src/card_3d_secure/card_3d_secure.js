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

        const action = { 
            data:{ 
                MD: "bE9kNWxpbWZVRHFmOHl4N0dNWUFvUT09Ic8m0ksoZpZlR7IA_ATL4fOLsaan3-HQvdgcMDTZCmVmZxPpgbrYoG8Iwb5cQkLsGwTwRJyWRrT4kEyDQ_a1EAicsdQA3G6Bi6acDzFola_OtnHWX2lneIu_-v0kLC5WIeIUNjS_vF1Szoufr9IJg_P3tM5gcU3kBmH1aiR-be__GhINiF1_x7eIg5FFMNDtt5SSKnG38UwCEX2KcYyG839u54VyoCaZjtEOsGIyvx6NhpghO7zG7gdCJf_Wus_8EYGz9ln72CDlJGl3QzawGgVyXCbIsnMLNDU1Lcd6NycAxBYlzVvMm2l27InKx2DvrjuP2g",
                PaReq: "eNpVUttuwjAM/RXGBzRJL/QiE6kDpKGJDgF9nqrUGt1oC2m6Qr9+CYWxRXnw8bEd+ziw20vE+RZFK5HDCpsm+8BRkU/HUeA5nu86HpuEru87r2MO63iDJw7fKJuirjizqGUDuUOdLsU+qxSHTJyelwlntuN6EyA3CCXK5ZzvsFHrsozFqS0kSiCDG6qsRJ7G7/HsKZrjoS6UQs8JF7O3FZArCaJuKyUvPLB11TuAVh74XqljExHSdZ2V5ResLFGXBIjhgDw6W7fGanStc5Hzt3naJztBV316Tj6/aNKLftvF5kyBmAjIM4XcpixkzGYj5kWeqy+Qqx+y0jTBF+lmxCi1KNXDDi44mpfiAWjOUH9doCWXWIkLD/1AD3NHgOdjXaGO0NL+2kAejc9ejMBCac1ce5DYD0KqLd9IfSVMlUJroxun1zIGADGp5LZFctu2tv79gh+oQa2q",
                TermUrl: "https://google.com"
            },
            method:"POST",
            paymentData: "Ab02b4c0!BQABAgA2h1ThIvkXb6aJ2+R5apwj5SjN4BIMjTveMKkZfJB1Yr0GgBb8s2xsxeN0YgP4U5frHGV6aO/QsxOPYk+2EzQ8WHK6+uH/qF9tGX5iPp7QEAzZQ4Mrc+eOB4d2n94hbw37fnpyFscjUIHvisrgIwOPLOhWBHBFQ7v/H4cSC6dD+t8xHoOJkcYZNE/yFpow+dAv5azNGm3oismTTlKboNefEd8a7l5fY+dGQ2/WgWNUEjozWHI9y5ontWaZYVUx7P+ji/qqDhfvhKFpznnNZY5pkmc1BXKMxdxWau3wNJsJvKO2A+txiLXLT+GTxHo+mFDHq7WX4wo3JIADyvekfexMIWEeLasiHJQ0s+SHFuzuvWb1EkLGgdRsjNQPaXuaeNASl7PFzEAfpkkOPqbvKQCK9gaW+/KK/yviwxscCkROAab6MTgUC2lIGr3c8PF5feBnZqm5Z9n+IDfJZrqk1dr3+YVMQ0SLrWEpypq5JKZ+k1pxTcCtIuRyP1J9UNeUdj6UB4BwXxh0cDzriOtsl8AWNixBd1bd8J+S60X4lkaoLJlq0DX5Kdc4ffDXGZQHW7m9sfykYbH5HPLLK1k5qlMezddldJQLbFrCig4a3T6F5cex7FcPMYf0epc7NAU4/nRiz14rpBe7ZxkXxuiKsblzuf2Wt5m6ePQHCDIHhEj99RBTxqqjSPcpcW76k/hfPIOSAEp7ImtleSI6IkFGMEFBQTEwM0NBNTM3RUFFRDg3QzI0REQ1MzkwOUI4MEE3OEE5MjNFMzgyM0Q2OERBQ0M5NEI5RkY4MzA1REMifQERA56+mNpw6qnfC9JloctJSOcYyowwitKwIScVjX+L0Ty214PnMgXmtbnJLj7VbR2WkwZiwGoJq7/dYJvdhOU255o1G0458k+nVPA3ojGtsB8L747sA+St76Y+MXnwYJ0rAqH6E6C3gSlld00O8CaRmMTVX8vrOrDAM6yPBaAuyB0/P+o1UHnQF6aYjsxzqj/hOVOGtxQ7Ey8J5z4/uA4a05DKkYJ5GIHoph7qFNotjf3we9Py1SS4jv4QsicRRodg+m4XbP5T4nZGhFPQqSAUBSuxKjvtnwf9JV+9St8nIbEZg0uEk3FWaauxMiJZK8Vdi3dhuMNuuOrTDv+ZsZ5k3UqcUngPVBqnMkyFMcA27Ql2jNqvMxzIiCSJ8gEN1RV5d76q3R36dLkZxCWkqFpqiFcXK73H1UJWgNdCI12bepHFPU5A7TkdKXY5HGcXIxS75FpLRI2f0RNKqPn6EF8aolEsZq4zVevqGkkQxfDCi5qJrPkOsyDWrIksgqAYMGjZvTKCwPFfyg95YqXNozCfwug0VfyQoueyMS+MapjfL4o+9rK7KYLT+lRMscFo4ZNMI0PDT9/S8cO/FRd6VW6mJkcLqlCq7V1Yf5OzkSCSH9JmdK+htgY8n0xmW/z5tXqWJyTVKZU5QORpoF0spCbnYqbgOoAmQuamZ5iA3r7AW4luZEaWK7qjezZlPbsOtkgkroB0pzAMvjbd3SuKS4A8npxSGSz+aTje/g3HqBYYNXhbL07ACWNgCWh9UIdSWTczLEXHzQKJcZOilujjAYRvbiQEZcvdmhy/impUodyhVKmDr0VBHiJFZ5I4SXC/syUwXpE0tPcLwwYC048UIalcz2s6Rev3zUYeX2gq0jeG5spDJfDV48K7krHiUVL7h8ePePA=",
            paymentMethodType: "scheme",
            type: "redirect",
            url: "https://test.adyen.com/hpp/3d/validate.shtml"
        }

        checkout.createFromAction(action).mount('#card-container_3d_secure');

});
