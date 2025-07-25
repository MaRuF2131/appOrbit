import { useState } from 'react';
import toast from 'react-hot-toast';
const NewsletterSignup = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = e => {
     e.preventDefault();
     if (!email) return toast.error('Please enter your email');
     // Simulate submission
     toast.success('Thanks for subscribing!');
     setEmail('');
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-6 bg-cyan-100 dark:bg-cyan-900 rounded-lg text-center">
      <h2 className="text-3xl font-bold mb-4 text-cyan-800 dark:text-cyan-200">
        Stay Updated
      </h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300">
        Subscribe to our newsletter to get the latest updates and offers.
      </p>
      <form onSubmit={handleSubmit} className="flex justify-center max-w-md mx-auto gap-4">
        <input
          type="email"
          placeholder="Your email address"
          className="flex-grow text-black dark:text-white p-3 rounded border border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded transition"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsletterSignup;
