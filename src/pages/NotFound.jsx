import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Button from '@/components/ui/Button';
import './NotFound.css';

function NotFound() {
  return (
    <section className="notfound">
      <div className="container notfound__inner">
        <motion.h1
          className="notfound__code"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        >
          404
        </motion.h1>
        <motion.p
          className="notfound__title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
        >
          This page wandered off to play
        </motion.p>
        <motion.p
          className="notfound__text"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.35 }}
        >
          The page you're looking for doesn't exist — but there are plenty of
          other things to explore.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
        >
          <Button as={Link} to="/" variant="primary" size="md">
            Back home
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default NotFound;
