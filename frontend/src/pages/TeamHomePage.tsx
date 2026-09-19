import {
  Avatar,
  Button,
  Card,
  Empty,
  List,
  Spin,
  Tag,
  Typography,
} from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import { getTeamClient } from '@ai-team/api/teamClientInstance';
import type { RunStatus, Team } from '@ai-team/api/TeamTypes';
import { useAionShell } from '@ai-team/host/AionShellAdapter';
import { aionNotification } from '@ai-team/host/AionNotificationAdapter';

const { Title, Text, Paragraph } = Typography;

const STATUS_LABEL: Record<RunStatus, string> = {
  idle: '空闲',
  queued: '排队中',
  running: '运行中',
  completed: '已完成',
  failed: '有异常',
};

const STATUS_COLOR: Record<RunStatus, string> = {
  idle: 'gray',
  queued: 'arcoblue',
  running: 'green',
  completed: 'arcoblue',
  failed: 'red',
};

const EVAL_LABEL = {
  unknown: { text: '未评测', color: 'gray' as const },
  passing: { text: '评测通过', color: 'green' as const },
  failing: { text: '评测未过', color: 'red' as const },
};

const TeamHomePage: React.FC = () => {
  const client = getTeamClient();
  const shell = useAionShell();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: teams, isLoading } = useSWR('ai-team:list', () => client.listTeams());

  const selected: Team | undefined = useMemo(() => {
    if (!teams || teams.length === 0) return undefined;
    return teams.find((team) => team.id === selectedId) ?? teams[0];
  }, [teams, selectedId]);

  const handleCreate = () => {
    aionNotification.info('新建团队（mock）：该能力将在接入后端后启用');
  };

  return (
    <div className='flex flex-col h-full min-h-0 bg-1 text-t-primary'>
      <div className='flex items-center justify-between px-24px pt-20px pb-12px shrink-0'>
        <Title heading={4} className='!mb-0'>
          AI Team
        </Title>
        <Button type='primary' icon={<IconPlus />} onClick={handleCreate}>
          新建团队
        </Button>
      </div>

      <div className='flex flex-1 min-h-0 gap-16px px-24px pb-20px'>
        <Card
          className='w-280px shrink-0 overflow-hidden flex flex-col'
          bodyStyle={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 8 }}
          bordered={false}
        >
          {isLoading ? (
            <div className='flex items-center justify-center h-full'>
              <Spin loading />
            </div>
          ) : !teams || teams.length === 0 ? (
            <Empty description='暂无团队' />
          ) : (
            <List
              dataSource={teams}
              render={(team) => (
                <div
                  key={team.id}
                  role='button'
                  tabIndex={0}
                  onClick={() => setSelectedId(team.id)}
                  className={classNames(
                    'flex items-center gap-10px px-10px py-8px rd-6px cursor-pointer outline-none',
                    selected?.id === team.id ? 'bg-5' : 'hover:bg-5'
                  )}
                >
                  <Avatar size={32} className='shrink-0'>
                    {team.name.slice(0, 1)}
                  </Avatar>
                  <div className='flex flex-col min-w-0'>
                    <Text className='!text-13px font-medium truncate'>{team.name}</Text>
                    <Text type='secondary' className='!text-12px truncate'>
                      {team.employeeCount} 名员工
                    </Text>
                  </div>
                </div>
              )}
            />
          )}
        </Card>

        <Card className='flex-1 min-w-0 overflow-auto' bordered={false}>
          {!selected ? (
            <div className='flex items-center justify-center h-full'>
              <Empty description='选择一个团队查看详情' />
            </div>
          ) : (
            <div className='flex flex-col gap-16px'>
              <div className='flex items-start justify-between gap-12px'>
                <div className='flex flex-col gap-6px min-w-0'>
                  <Title heading={5} className='!mb-0'>
                    {selected.name}
                  </Title>
                  <Paragraph type='secondary' className='!mb-0'>
                    {selected.goal}
                  </Paragraph>
                </div>
                <div className='flex items-center gap-8px shrink-0'>
                  <Tag color={STATUS_COLOR[selected.status]}>{STATUS_LABEL[selected.status]}</Tag>
                  {selected.evaluationStatus && (
                    <Tag color={EVAL_LABEL[selected.evaluationStatus].color}>
                      {EVAL_LABEL[selected.evaluationStatus].text}
                    </Tag>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-3 gap-12px'>
                <Card className='bg-2' bordered={false}>
                  <Text type='secondary' className='!text-12px'>
                    员工数
                  </Text>
                  <div className='text-22px font-semibold mt-4px'>{selected.employeeCount}</div>
                </Card>
                <Card className='bg-2' bordered={false}>
                  <Text type='secondary' className='!text-12px'>
                    进行中任务
                  </Text>
                  <div className='text-22px font-semibold mt-4px'>{selected.activeRunCount}</div>
                </Card>
                <Card className='bg-2' bordered={false}>
                  <Text type='secondary' className='!text-12px'>
                    当前版本
                  </Text>
                  <div className='text-22px font-semibold mt-4px'>v{selected.version}</div>
                </Card>
              </div>

              <Card className='bg-2' bordered={false}>
                <Text type='secondary' className='!text-12px block mb-6px'>
                  最近产物
                </Text>
                <Text>{selected.latestArtifactName ?? '—'}</Text>
              </Card>

              <div className='flex justify-end'>
                <Button type='primary' onClick={() => shell.openTeam(selected.id)}>
                  进入团队工作台
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TeamHomePage;
