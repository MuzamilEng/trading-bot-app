import { StripeProvider } from '@stripe/stripe-react-native';
import PaymentScreen from '../../components/PaymentScreen/PaymentScreen';

function Payment() {
  return (
    <StripeProvider
      publishableKey={'pk_test_51OvmpoEWhpY7ASOw4YwOtVI4czVFxUxKVmrbuJkkTY7xrgHWzwFzlYaG92GHB4uQsPBPlSA1oUkMvgunyVe8ZRio00fevIPiwK'}
    //   merchantIdentifier="merchant.identifier" // required for Apple Pay
    //   urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      <PaymentScreen />
    </StripeProvider>
  );
}

export default Payment;