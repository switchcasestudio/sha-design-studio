import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import './NotFound.css';

function NotFound() {
  return (
    <section className="notfound">
      <div className="container notfound__inner">
        <h1 className="notfound__code">404</h1>
        <p className="notfound__title">This page wandered off to play</p>
        <p className="notfound__text">
          The page you're looking for doesn't exist — but there are plenty of
          other things to explore.
        </p>
        <Button as={Link} to="/" variant="primary" size="md">
          Back home
        </Button>
      </div>
    </section>
  );
}

export default NotFound;
