import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51LfIfhC41VPCXubIkiBCyJKVQ5M1eQ2VK2p6Qcm83mxJNSNpyqHf5sZuYeRp652bclbPSyM5VPpvLYP7XxTHwyOI00EQ4JG9Xa'
);

export const bookTour = async (tourId) => {
  try {
    // 1) get checkout session from the API
    const session = await axios({
      method: 'POST',
      url: `/api/v1/bookings/create-checkout-session/${tourId}`,
    });

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error, err');
  }
};
