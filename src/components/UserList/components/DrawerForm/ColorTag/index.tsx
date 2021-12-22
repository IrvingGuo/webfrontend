import { privColorMap } from '@/utils/constants';
import { Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/interface/generator';

export const ColorTag = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  return (
    <Tag color={privColorMap.get(Number(value))} closable={closable} onClose={onClose}>
      {label}
    </Tag>
  );
};

export default ColorTag;
