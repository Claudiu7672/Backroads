const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = catchAsync(async (req, res) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create the PRODUCT and PRICE ID's (PRICE ID is required by Stripe when creating the checkout session)
  const product = await stripe.products.create({
    name: `${tour.name} Tour`,
    description: tour.summary,
    images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
  });
  const price = await stripe.prices.create({
    product: `${product.id}`,
    unit_amount: tour.price * 100,
    currency: 'usd',
  });

  // 3) Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: `${price.id}`,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
  });

  // 4) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});
