# How payments work?

    * A user sends a string defining the product to the backed
    * The backend does the following
        * Generates a stripe session
        * Stores the stripe session data in the profile.lastPaymentData field
        * Generates a payment URL and send it to the frontend
    * When user has done the payment he/she is redirected to /stripe-payment-success
    * It then sends a request to verify the payment to the backend
    * The backend retrieves the profile.lastPaymentData field and checks if that payment was a success
    * If payment was a success
        * A doc is added to the payments collection
        * Token values are updated on the profile doc
    * To test payment use the following card
        * 4242 4242 4242 4242
