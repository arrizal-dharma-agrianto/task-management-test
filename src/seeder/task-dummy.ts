import type { Task } from 'src/types/task';

function randomChoice<T>(arr: T[]): T {
  if (arr.length === 0) {
    throw new Error('Cannot choose from an empty array');
  }
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function generateRandomTitle(): string {
  const words = [
    'Implement',
    'Fix',
    'Update',
    'Review',
    'Optimize',
    'Refactor',
    'Design',
    'Integrate',
    'Document',
    'Deploy',
    'Investigate',
    'Configure',
    'Add',
    'Remove',
    'Improve',
    'Test',
    'Analyze',
    'Support',
  ];
  const objects = [
    'API',
    'Frontend',
    'Database',
    'Authentication',
    'Dashboard',
    'Performance',
    'Task Module',
    'Notification System',
    'User Profile',
    'Admin Panel',
    'Search Feature',
    'Payment Gateway',
    'Report Generator',
    'Analytics',
  ];
  const extras = [
    'for better UX',
    'to fix bugs',
    'with new design',
    'for release v1.2',
    'as requested by client',
    'based on feedback',
    'to improve performance',
    'with enhanced security',
    'to reduce load time',
  ];

  // Title panjang: <action> <object> <extra>
  return `${randomChoice(words)} ${randomChoice(objects)} ${randomChoice(extras)}`;
}

export function generateDummyTasks(count: number): Task[] {
  const priorities: Task['priority'][] = ['low', 'medium', 'high'];
  const assignees = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan'];
  const now = new Date();

  return Array.from({ length: count }, (_, i) => {
    const due = new Date(now);
    due.setDate(due.getDate() + (i % 10));

    return {
      id: String(i + 1),
      title: generateRandomTitle(), // pakai title random panjang
      desc: `This is a description for task ${i + 1}`,
      priority: randomChoice(priorities),
      assignee: randomChoice(assignees),
      due_date: due.toISOString().slice(0, 10),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      is_complete: i % 5 === 0,
    };
  });
}
