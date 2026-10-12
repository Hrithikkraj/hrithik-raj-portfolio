import { motion, type Variants } from 'framer-motion';
import '../assets/styles/Contact.scss';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const sectionVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

function Contact() {
  const reduced = prefersReduced();
   // Replace this with your phone number.

  return (
    <section id="contact" className="contact-section">
      <div className="contact-bg-blobs" aria-hidden="true">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      <motion.div
        className="contact-inner"
        variants={reduced ? {} : sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="contact-heading" variants={reduced ? {} : itemVariants}>
          <h1>Contact need?</h1>
          <p>Got a project waiting to be realized? Let's collaborate and make it happen!</p>
        </motion.div>

        <div className="contact-layout">
          <motion.aside className="contact-aside" variants={reduced ? {} : itemVariants}>
            <span className="contact-aside__eyebrow">Open to opportunities</span>
            <h2>Have an idea? Let's turn it into something real.</h2>
            <p className="contact-aside__copy">
              I enjoy working on thoughtful products, polished interfaces, and practical ideas that make a difference.
            </p>

            <div className="contact-aside__status">
              <span className="contact-aside__status-dot" aria-hidden="true" />
              <span>Currently available for select projects</span>
            </div>

            <div className="contact-aside__meta">

              <span>Based in India</span>
              <span>Usually replies within 24 hours</span>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}

export default Contact;
