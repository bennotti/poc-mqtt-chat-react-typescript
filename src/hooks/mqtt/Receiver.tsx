import React, { FC, useEffect, useState } from 'react';
import { Card, List } from 'antd';
import { AnyObject } from '../../types';

interface ComponenteProps {
  payload?: AnyObject;
};

const Receiver: FC<ComponenteProps> = ({
  payload
}) => {
  const [messages, setMessages] = useState<Array<AnyObject>>([])

  useEffect(() => {
    if (payload && payload?.topic) {
      setMessages(messages => [...messages, payload])
    }
  }, [payload])

  const renderListItem = (item: AnyObject) => (
    <List.Item>
      <List.Item.Meta
        title={item.topic}
        description={item.message}
      />
    </List.Item>
  )

  return (
    <Card
      title="Receiver"
    >
      <List
        size="small"
        bordered
        dataSource={messages}
        renderItem={renderListItem}
      />
    </Card>
  );
}

export default Receiver;