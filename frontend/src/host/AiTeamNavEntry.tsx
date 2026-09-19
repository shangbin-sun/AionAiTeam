import React from 'react';
import { Tooltip } from '@arco-design/web-react';
import { Peoples } from '@icon-park/react';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SiderTooltipProps } from '@renderer/utils/ui/siderTooltip';

interface AiTeamNavEntryProps {
  collapsed: boolean;
  siderTooltipProps: SiderTooltipProps;
  onActivated?: () => void;
}

const AiTeamNavEntry: React.FC<AiTeamNavEntryProps> = ({
  collapsed,
  siderTooltipProps,
  onActivated,
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isActive = pathname.startsWith('/aiteam');

  const handleClick = () => {
    void navigate('/aiteam');
    onActivated?.();
  };

  if (collapsed) {
    return (
      <Tooltip {...siderTooltipProps} content='AI Team' position='right'>
        <div
          className={classNames(
            'w-full h-34px flex items-center justify-center cursor-pointer transition-colors rd-8px text-t-primary',
            isActive ? 'bg-fill-3' : 'hover:bg-fill-3 active:bg-fill-4'
          )}
          onClick={handleClick}
        >
          <Peoples
            theme='outline'
            size='20'
            fill='currentColor'
            className='block leading-none shrink-0'
            style={{ lineHeight: 0 }}
          />
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip {...siderTooltipProps} content='AI Team' position='right'>
      <div
        className={classNames(
          'box-border group h-34px w-full flex items-center justify-start gap-8px ps-10px pe-8px rd-0.5rem cursor-pointer shrink-0 transition-all text-t-primary',
          isActive ? 'bg-fill-3' : 'hover:bg-fill-3 active:bg-fill-4'
        )}
        onClick={handleClick}
      >
        <span className='size-22px flex items-center justify-center shrink-0 text-t-primary'>
          <Peoples
            theme='outline'
            size='16'
            fill='currentColor'
            className='block leading-none'
            style={{ lineHeight: 0 }}
          />
        </span>
        <span className='collapsed-hidden text-t-primary text-14px font-[500] leading-24px'>
          AI Team
        </span>
      </div>
    </Tooltip>
  );
};

export default AiTeamNavEntry;
