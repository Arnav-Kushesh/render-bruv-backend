/*

    I am avoiding webhook because if for some reason it fails
    There will be no way to know that

    If the server goes down or because of the network issue webhook is not triggered

    Also, there isn't a robust way to test webhook

    If something can't be tested well, it should not be used

*/

export default function dodoPaymentWebhook() {}
