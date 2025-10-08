export default function Footer() {
  return (
    <footer className="footer footer-center py-2 bg-base-300 text-base-content">
      <div>
        <p className="font-bold">
          Opportune © {new Date().getFullYear()} - Explore. Compete. Grow.
        </p>
        <p className="text-sm opacity-70">
          Built for students, colleges & communities worldwide.
        </p>
      </div>
    </footer>
  );
}
