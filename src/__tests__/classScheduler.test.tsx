import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClassScheduler from '@/components/ClassScheduler';

// Mock react-dnd
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }: { children: ReactNode }) => children,
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{}, jest.fn()]
}));

// Mock Dialog from radix-ui
import { ReactNode } from 'react';

jest.mock('@radix-ui/react-dialog', () => ({
  Dialog: ({ children }: { children: ReactNode }) => children,
  DialogTrigger: ({ children }: { children: ReactNode }) => children,
  DialogContent: ({ children }: { children: ReactNode }) => children,
  DialogHeader: ({ children }: { children: ReactNode }) => children,
  DialogTitle: ({ children }: { children: ReactNode }) => children
}));

describe('ClassScheduler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial schedule layout', () => {
    render(<ClassScheduler/>);
    
    // Check weekdays
    expect(screen.getByText('Montag')).toBeInTheDocument();
    expect(screen.getByText('Dienstag')).toBeInTheDocument();
    
    // Check class names
    expect(screen.getByText('Class1')).toBeInTheDocument();
    expect(screen.getByText('Class2')).toBeInTheDocument();
    
    // Check time slots
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  test('allows adding a new card', () => {
    render(<ClassScheduler />);
    
    // Click add button
    const addButtons = screen.getAllByTitle('Neue Karte hinzufügen');
    fireEvent.click(addButtons[0]);
    
    // Check if form appears
    expect(screen.getByText('Neue Karte hinzufügen')).toBeInTheDocument();
  });

  test('allows blocking a time slot', () => {
    render(<ClassScheduler />);
    
    // Find and click block button
    const blockButton = screen.getAllByTitle('Zeitfenster sperren')[0];
    fireEvent.click(blockButton);
    
    // Verify slot is blocked
    expect(screen.getAllByTitle('Zeitfenster entsperren')[0]).toBeInTheDocument();
  });

  test('renders with initial schedule data', () => {
    const initialSchedule = {
      Montag: {
        Class1: {
          A: Array(8).fill(null),
          B: Array(8).fill(null)
        }
      }
    };
    
    render(<ClassScheduler initialSchedule={initialSchedule} />);
    expect(screen.getByText('Montag')).toBeInTheDocument();
  });
});