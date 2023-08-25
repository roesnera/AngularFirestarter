export interface Board {
    id?: string;
    title?: string;
    priority?: number;
    tasks?: Task[]
}

export interface Task {
    description?: string;
    label?: taskLabel;
}

export type taskLabel = 'purple' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';

export interface BoardToWrite extends Board {
    uid?: string | undefined;
}