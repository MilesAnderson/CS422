/*
Moo-Deng
Authors:
Andrew Chan

Date Created: 8 Oct 2024

Description:
This file, `App.test.js`, contains unit tests for the root `App` component. It uses React Testing Library to verify that key elements, such as the "learn react" link, are rendered correctly in the application.
*/

import { render, screen } from '@testing-library/react'; // Testing utilities for rendering components and querying DOM elements
import App from './App'; // Root application component

// Test case: Verify that the "learn react" link is rendered
test('renders learn react link', () => {
  // Render the `App` component into the testing environment
  render(<App />);

  // Query for the "learn react" link in the rendered output
  const linkElement = screen.getByText(/learn react/i);

  // Assert that the link is present in the document
  expect(linkElement).toBeInTheDocument();
});

