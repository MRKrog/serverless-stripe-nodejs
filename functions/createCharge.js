const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.handler = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);

  const token = requestBody.token.id;
  const amount = requestBody.charge.amount;
  const currency = requestBody.charge.currency;
  const productId = requestBody.charge.productId;
  const description = 'Charge for description add here';
  const receipt_email = 'mkrogdepaul@gmail.com';

  try {
    const charge = await stripe.charges.create({ amount, currency, source: token, description, receipt_email });
    const productAmount = await stripe.products.retrieve(productId);

    await callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: `Charge processed succesfully!`,
        charge,
        metadata: {'token_amount': productAmount.metadata.levar_tokens}
      }),
    });
  } catch (err){
    callback(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: `${err.message} more here`,
      }),
    });
  }
};
