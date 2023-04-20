export interface TaskTypes {
  id: number;
  title: string;
  status: string;
  priority: string;
  totalComments: number;
  totalSubTasks: number;
  subTaskCompleted: number;
  dueDate: string;
}

const tasks: TaskTypes[] = [
  {
    id: 1,
    title: 'Ubold v3.0 - Redesign',
    status: 'Pending',
    priority: 'High',
    totalComments: 28,
    totalSubTasks: 10,
    subTaskCompleted: 1,
    dueDate: 'Jul 18, 2019',
  },
  {
    id: 2,
    title: 'Minton v3.0 - Redesign',
    status: 'Inprogress',
    priority: 'Low',

    totalComments: 21,
    totalSubTasks: 7,
    subTaskCompleted: 4,
    dueDate: 'Jul 20, 2019',
  },
  {
    id: 3,
    title: 'Shreyu v2.1 - Angular and Django',
    status: 'Review',
    priority: 'Low',

    totalComments: 24,
    totalSubTasks: 2,
    subTaskCompleted: 1,
    dueDate: 'Jul 21, 2019',
  },
  {
    id: 4,
    title: 'Shreyu v2.1 - React, Webpack',
    status: 'Done',
    priority: 'High',

    totalComments: 21,
    totalSubTasks: 5,
    subTaskCompleted: 5,
    dueDate: 'Jul 22, 2019',
  },
  {
    id: 5,
    title: 'Shreyu 2.2 - Vue.Js and Laravel',
    status: 'Pending',
    priority: 'Low',

    totalComments: 2,
    totalSubTasks: 5,
    subTaskCompleted: 2,
    dueDate: 'Jul 18, 2019',
  },
  {
    id: 6,
    title: 'Shreyu 2.3 - Rails, NodeJs, Mean',
    status: 'Pending',
    priority: 'Medium',

    totalComments: 24,
    totalSubTasks: 8,
    subTaskCompleted: 2,
    dueDate: 'Jul 21, 2019',
  },
  {
    id: 7,
    title: 'Shreyu - Landing page and UI Kit',
    status: 'Review',
    priority: 'Medium',

    totalComments: 11,
    totalSubTasks: 6,
    subTaskCompleted: 4,
    dueDate: 'Jul 10, 2019',
  },
  {
    id: 8,
    title: 'Shreyu 3.0 - Scoping',
    status: 'Inprogress',
    priority: 'High',

    totalComments: 10,
    totalSubTasks: 4,
    subTaskCompleted: 3,
    dueDate: 'Jul 24, 2019',
  },
];

export { tasks };
