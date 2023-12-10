export enum Type {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning',
}

export type NotificationType = {
    id?: any
    type: Type
    title: string
    content: string
    timeout: number
}

export interface NotificationProps extends NotificationType {
    index: number
    total: number
    remove: (id: any) => void
}

export interface NotificationsProps {
    notifications: NotificationType[]
    remove: (id: any) => void
    pause: () => void
    resume: () => void
    animationDuration: number
}
