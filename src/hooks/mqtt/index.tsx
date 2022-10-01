import React, { createContext, useEffect, useState } from 'react';
import Connection from './Connection';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import Receiver from './Receiver';
import mqtt, { IClientOptions, MqttClient } from 'mqtt';
import { AnyObject } from '../../types';

interface IQosOption {
  label: string;
  value: number;
}

export const QosOption = createContext<Array<IQosOption>>([])
const qosOption: Array<IQosOption> = [
  {
    label: '0',
    value: 0,
  }, {
    label: '1',
    value: 1,
  }, {
    label: '2',
    value: 2,
  },
];

const HookMqtt = () => {
  const [client, setClient] = useState<MqttClient | undefined>(undefined);
  const [isSubed, setIsSub] = useState<boolean>(false);
  const [payload, setPayload] = useState<AnyObject | undefined>(undefined);
  const [connectStatus, setConnectStatus] = useState('Connect');

  const mqttConnect = (host: string, mqttOption: IClientOptions) => {
    setConnectStatus('Connecting');
    setClient(mqtt.connect(host, mqttOption));
  };

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', (err: any) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic: any, message: any) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]);

  const mqttDisconnect = () => {
    if (client) {
      client.end(false, undefined, () => {
        setConnectStatus('Connect');
      });
    }
  }

  const mqttPublish = (context: any) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, error => {
        if (error) {
          console.log('Publish error: ', error);
        }
      });
    }
  }

  const mqttSub = (subscription: any) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error: any) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        setIsSub(true)
      });
    }
  };

  const mqttUnSub = (subscription: any) => {
    if (client) {
      const { topic } = subscription;
      client.unsubscribe(topic, undefined, error => {
        if (error) {
          console.log('Unsubscribe error', error)
          return
        }
        setIsSub(false);
      });
    }
  };

  return (
    <>
      <Connection connect={mqttConnect} disconnect={mqttDisconnect} connectBtn={connectStatus} />
      <QosOption.Provider value={qosOption}>
        <Subscriber sub={mqttSub} unSub={mqttUnSub} showUnsub={isSubed} />
        <Publisher publish={mqttPublish} />
      </QosOption.Provider>
      <Receiver payload={payload}/>
    </>
  );
}

export default HookMqtt;