import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTopButton } from '../src/components/ScrollToTopButton';
import useScrollPosition from '../src/hooks/useScrollPosition';

// Mock the custom hook
jest.mock('../src/hooks/useScrollPosition');

describe('ScrollToTopButton', () => {
  const mockUseScrollPosition = useScrollPosition as jest.Mock;
  const scrollToSpy = jest.fn();

  beforeAll(() => {
    window.scrollTo = scrollToSpy;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when scroll position is less than 500', () => {
    mockUseScrollPosition.mockReturnValue(100);
    render(<ScrollToTopButton />);
    const button = screen.queryByRole('button', { name: /scroll to top/i });
    expect(button).not.toBeInTheDocument();
  });

  it('renders when scroll position is greater than 500', () => {
    mockUseScrollPosition.mockReturnValue(600);
    render(<ScrollToTopButton />);
    const button = screen.getByRole('button', { name: /scroll to top/i });
    expect(button).toBeInTheDocument();
  });

  it('scrolls to top when clicked', () => {
    mockUseScrollPosition.mockReturnValue(600);
    render(<ScrollToTopButton />);
    const button = screen.getByRole('button', { name: /scroll to top/i });

    fireEvent.click(button);

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
