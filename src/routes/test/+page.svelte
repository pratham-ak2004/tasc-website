<script lang="ts">
	import { onMount } from 'svelte';

	// 2. import library
	let googlePayButton;

	onMount(async () => {
		const googlePayButtonModule = await import('@google-pay/button-element');
		googlePayButton = googlePayButtonModule.default;
	});

	// 4. configure button properties
	const paymentRequest: google.payments.api.PaymentDataRequest = {
		apiVersion: 2,
		apiVersionMinor: 0,
		allowedPaymentMethods: [
			{
				type: 'CARD',
				parameters: {
					allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
					allowedCardNetworks: ['MASTERCARD', 'VISA']
				},
				tokenizationSpecification: {
					type: 'PAYMENT_GATEWAY',
					parameters: {
						gateway: 'checkoutltd',
						gatewayMerchantId: 'Channel 1 (ID: pc_bpoclsnrnlfexiw2lohkjr2cwu)'
					}
				}
			}
		],
		merchantInfo: {
			merchantId: 'BCR2DN4T27PODAAE',
			merchantName: 'Test'
		},
		transactionInfo: {
			totalPriceStatus: 'FINAL',
			totalPriceLabel: 'Entry Fees',
			totalPrice: '1.00',
			currencyCode: 'INR',
			countryCode: 'IN'
		}
	};

	function onLoadPaymentData(event) {
		console.log('load payment data', event.detail);
	}

    // let googlePayClient
    // onMount(() => {
    //     googlePayClient = new google.payments.api.PaymentsClient({
    //         environment: 'TEST'
    //     });

    //     const clientConfiguration = {
    //         apiVersion: 2,
    //         apiVersionMinor: 0,
    //         allowedPaymentMethods: [ {
    //             type: 'CARD',
    //             parameters: {
    //                 allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
    //                 allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA']
    //             },
    //             tokenizationSpecification: {
    //                 type: 'PAYMENT_GATEWAY',
    //                 parameters: {
    //                     gateway: 'example',
    //                     gatewayMerchantId: 'exampleGatewayMerchantId'
    //                 }
    //             }
    //         }]
    //     }

    //     googlePayClient.isReadyToPay(clientConfiguration).then((response) => {
    //         if (response.result) {
    //             console.log('ready to pay');
    //         } else {
    //             console.log('not ready to pay');
    //         }
    //     }).catch((err) => {
    //         console.log(err);
            
    //     });

    //     googlePayClient.createButton({
    //         buttonColor: "default",
    //         buttonType: "long",
    //         onClick: () => {
    //             console.log('button clicked');
    //         }
    //     })

    //     googlePayClient.loadPaymentData(clientConfiguration).then((paymentData) => {
    //         console.log('payment data', paymentData);
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    // });
</script>

<!-- 3. add button -->
{#if googlePayButton}
	<google-pay-button environment="PRODUCTION" button-color="white" {paymentRequest} on:loadpaymentdata={onLoadPaymentData} />
{/if}
