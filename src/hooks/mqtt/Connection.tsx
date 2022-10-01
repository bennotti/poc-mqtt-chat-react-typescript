import React, { FC } from 'react';
import { Card, Button, Form, Input, Row, Col } from 'antd';
import { IClientOptions } from 'mqtt';

interface ComponenteProps {
  connect?: (host: string, mqttOption: IClientOptions) => void;
  disconnect?: () => void;
  connectBtn?: string;
};

const Connection: FC<ComponenteProps> = ({
  connect,
  disconnect,
  connectBtn = 'Connect'
}) => {
  const [form] = Form.useForm();
  const record = {
    host: 'broker.emqx.io',
    clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
    port: 8083,
    username: 'emqx',
    password: 'public'
  };
  const onFinish = (values: any) => {
    const { host, clientId, port, username, password } = values;
    const url = `ws://${host}:${port}/mqtt`;
    const options: IClientOptions = {
      keepalive: 30,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'Csharp/mqtt',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      },
      rejectUnauthorized: false
    };
    options.clientId = clientId;
    options.username = username;
    options.password = password;
    connect?.(url, options);
  };

  const handleConnect = () => {
    form.submit();
  };

  const handleDisconnect = () => {
    disconnect?.();
  };

  const ConnectionForm = (
    <Form
      layout="vertical"
      name="basic"
      form={form}
      initialValues={record}
      onFinish={onFinish}
    >
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item
            label="Host"
            name="host"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Port"
            name="port"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Client ID"
            name="clientId"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Username"
            name="username"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Password"
            name="password"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Card
      title="Connection"
      actions={[
        <Button type="primary" onClick={handleConnect}>{connectBtn}</Button>,
        <Button danger onClick={handleDisconnect}>Disconnect</Button>
      ]}
    >
      {ConnectionForm}
    </Card>
  );
}

export default Connection;