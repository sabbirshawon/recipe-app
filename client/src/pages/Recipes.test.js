import React from 'react';
import { render, cleanup } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'
import App from "../App";

afterEach(cleanup);

it("tests the Recipes container is not empty", () => {
  const { getByTestId } = render(<App />);
  expect(getByTestId('recipes')).not.toBeEmpty();
});