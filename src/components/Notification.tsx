import { memo } from 'react';
import { BsCheckLg, BsXLg, BsInfoLg, BsExclamationLg } from 'react-icons/bs';
import { MdClose } from 'react-icons/md';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { NotificationProps, NotificationsProps } from "../types";
import '../App.scss';

const STACKING_OVERLAP = 0.9; // A range from 0 to 1 representing the percentage of the notification's height that should overlap the next notification
const NOTIFICATION_ICON = {
    success: BsCheckLg,
    error: BsXLg,
    info: BsInfoLg,
    warning: BsExclamationLg,
};

const Notification = memo(({ id, title, content, type, index, total, remove }: NotificationProps) => {
    const Icon = NOTIFICATION_ICON[type];
    const inverseIndex = total - index - 1;
    const scale = 1 - inverseIndex * 0.05;
    const opacity = 1 - (inverseIndex / total) * 0.1;
    const bg = `hsl(0 0% ${100 - inverseIndex * 15}% / 40%)`;
    const y = inverseIndex * 100 * STACKING_OVERLAP;

    return (
        <div
            className='notification'
            style={{'--bg': bg, '--opacity': opacity, '--scale': scale, '--y': `${y}%`}}>
            <div className='notification-inner'>
                <div className={`icon ${type}`}>
                    <Icon/>
                </div>
                <div>
                    <h2>{title}</h2>
                    <p>{content}</p>
                </div>
                <button className='close' onClick={() => remove(id)}><MdClose/></button>
            </div>
        </div>
    );
});

export const Notifications = ({ notifications, remove, pause, resume, animationDuration }: NotificationsProps) => {

    return (
        <TransitionGroup className='notifications' style={{ '--duration': `${animationDuration}ms` }} onMouseEnter={pause} onMouseLeave={resume}>
            {[...notifications].reverse().map((notification, index) => (
                <CSSTransition key={notification.id} timeout={animationDuration}>
                    <Notification
                        {...notification}
                        remove={remove}
                        index={index}
                        total={notifications.length}/>
                </CSSTransition>
            ))}
        </TransitionGroup>
    );
}

