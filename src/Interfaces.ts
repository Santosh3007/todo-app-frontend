export interface item {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  tag: string;
  tagColor: string;
  completed: boolean;
}
export interface subTask {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  tag: string;
  tagColor: string;
  completed: boolean;
  task_id: number;
}