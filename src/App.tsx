import './App.scss';
import { useCallback, useState, useRef } from 'react';
import { MdAdd } from 'react-icons/md';
import { nanoid } from 'nanoid';
import { Notifications } from './components/Notification';
import { Type, NotificationType } from "./types";

const TIMEOUT = 5000; // Notifications will be removed automatically after 5 seconds, unless hovered over.
const ANIMATION_DURATION = 400;
const MAX_NOTIFICATIONS = 5;

const useNotifications = () => {
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const paused = useRef(null);
  const [notifications, setNotifications] = useState([] as NotificationType[]);

  const add = useCallback((n: NotificationType) => {
      const notification = { ...n };
      notification.id = nanoid();
      notification.timeout += Date.now();
      setNotifications(n => {
          const next = [notification, ...n];
          if (n.length >= MAX_NOTIFICATIONS) {
              next.pop();
          }
          return next;
      });
      timeouts.current.push(setTimeout(() => {
          remove(notification.id);
      }, notification.timeout - Date.now()));
  }, []);

  const pause = useCallback(() => {
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];
      paused.current = Date.now();
  }, []);

  const resume = useCallback(() => {
      setNotifications(n => {
          return n.map(notification => {
              notification.timeout += Date.now() - paused.current;
              timeouts.current.push(setTimeout(() => {
                  remove(notification.id);
              }, notification.timeout - Date.now()));
              return notification;
          });
      });
  }, [notifications]);

  const remove = useCallback((id: string) => {
      setNotifications(n => n.filter(n => n.id !== id));
  }, []);

  const props = { notifications, remove, pause, resume };

  return { props, add };
};

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function App() {
  const { props, add } = useNotifications();
  return (
    <div className="App">
      <Notifications {...props} animationDuration=          {ANIMATION_DURATION}/>
        <button className='add-button' onClick={() => {
            const types =  Object.keys(Type);
            const type = types[randomInt(0, types.length - 1)] as Type;
            const title = `${type[0].toUpperCase() + type.slice(1)} Notification`;
            add({ title, content: 'Some notification description', timeout: TIMEOUT, type })
        }}><MdAdd/>Add Notification</button>
    </div>
  );
}

export default App;
