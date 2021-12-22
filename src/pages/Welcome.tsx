import { Image } from 'antd';
import welcome from '../assets/welcome.svg';

const WelcomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <Image width="60%" src={welcome} preview={false} alt="https://iradesign.io" />
    </div>
  );
};

export default WelcomePage;
