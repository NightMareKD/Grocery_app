import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PantryItemCard from '../PantryItemCard';

const mockItem = {
  id: 1,
  name: 'Test Item',
  quantity: 2,
  unit: 'pieces',
  expiry_date: '2025-02-01',
  notes: 'Test notes',
  created_at: '2025-01-01T00:00:00.000Z'
};

describe('PantryItemCard', () => {
  it('renders item information correctly', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <PantryItemCard 
        item={mockItem} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('pieces')).toBeInTheDocument();
    expect(screen.getByText('Test notes')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <PantryItemCard 
        item={mockItem} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByLabelText('Edit item');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockItem);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <PantryItemCard 
        item={mockItem} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByLabelText('Delete item');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockItem);
  });

  it('shows out of stock indicator when quantity is 0', () => {
    const outOfStockItem = { ...mockItem, quantity: 0 };
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    render(
      <PantryItemCard 
        item={outOfStockItem} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});