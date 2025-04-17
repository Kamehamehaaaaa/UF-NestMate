import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RoommatePreferencesForm from './RoommatePreferencesForm';

describe('RoommatePreferencesForm', () => {
  const mockPreferences = {
    budget: { min: '500', max: '1500' },
    major: 'Computer Science',
    hobbies: 'Hiking, Reading',
    food: 'vegetarian',
    sleeping_habit: 'late sleeper',
    smoking: 'no',
    cleanliness: 4,
    gender_preference: 'male',
    pet_preference: 'fine with pets'
  };

  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  test('renders form with initial preferences', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    const selects = screen.getAllByRole('combobox');
    expect(selects[0]).toHaveValue('vegetarian');
    expect(selects[1]).toHaveValue('late sleeper');
    expect(selects[2]).toHaveValue('fine with pets');
  });
  
  

  test('updates budget range when inputs change', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    const minInput = screen.getByDisplayValue('500');
    const maxInput = screen.getByDisplayValue('1500');
    
    fireEvent.change(minInput, { target: { value: '600' }});
    fireEvent.change(maxInput, { target: { value: '1600' }});
    
    expect(minInput.value).toBe('600');
    expect(maxInput.value).toBe('1600');
  });

  test('updates major field when changed', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    const majorInput = screen.getByDisplayValue('Computer Science');
    fireEvent.change(majorInput, { target: { value: 'Biology' }});
    
    expect(majorInput.value).toBe('Biology');
  });

  test('updates hobbies field when changed', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    const hobbiesInput = screen.getByDisplayValue('Hiking, Reading');
    fireEvent.change(hobbiesInput, { target: { value: 'Swimming' }});
    
    expect(hobbiesInput.value).toBe('Swimming');
  });

  test('changes food preference dropdown selection', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    
    const selects = screen.getAllByRole('combobox');
    const foodSelect = selects[0];
    fireEvent.change(foodSelect, { target: { value: 'non-vegetarian' }});
    
    expect(foodSelect.value).toBe('non-vegetarian');
  });
  
  

  test('toggles smoking preference radio buttons', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    const yesRadio = screen.getByLabelText('YES');
    fireEvent.click(yesRadio);
    
    expect(yesRadio.checked).toBe(true);
  });

  test('adjusts cleanliness slider', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '2' }});
    
    expect(slider.value).toBe('2');
  });

  test('changes gender preference radio buttons', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    const femaleRadio = screen.getByLabelText('FEMALE');
    fireEvent.click(femaleRadio);
    
    expect(femaleRadio.checked).toBe(true);
  });

  

  test('submits form with updated data', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    // Change a field
    const majorInput = screen.getByDisplayValue('Computer Science');
    fireEvent.change(majorInput, { target: { value: 'Mathematics' }});
    
    // Submit form
    fireEvent.click(screen.getByText('Save Preferences'));
    
    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      major: 'Mathematics'
    }));
  });

 
  

  test('validates numeric inputs for budget', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    const minInput = screen.getByDisplayValue('500');
    fireEvent.change(minInput, { target: { value: 'abc' }});
    
    expect(minInput.value).toBe('');
  });

  test('maintains cleanliness value between 1-5', () => {
    render(<RoommatePreferencesForm preferences={mockPreferences} onSave={mockOnSave} />);
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '6' }});
    expect(slider.value).toBe('5');
    
    fireEvent.change(slider, { target: { value: '0' }});
    expect(slider.value).toBe('1');
  });
});
