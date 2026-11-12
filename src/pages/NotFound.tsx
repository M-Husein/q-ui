import { Link } from 'react-router';
import { DEFAULT_PATH } from './routes';
import { PageHeader } from '../layout/demo';

export const NotFound = () => (
  <>
    <PageHeader title="Page not found" description="This demo page does not exist." />
    <Link to={DEFAULT_PATH} className="btn btn-primary">Back to Button</Link>
  </>
);
