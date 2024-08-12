import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../../src/App";

// all tests are included in github actions workflow file to run on every push to the repository
// in github actions environment, the frontend does not have access to the backend
// we override the VITE_API_BASE_URL env var with VITE_PROD_API_URL_FULL defined in github secrets
// this allows the tests to run against the deployed backend which uses MongoDB Atlas
test("student logs in successfully, navigates between all main routes, and logs out", async () => {
  // 1 - render app
  const wrapper = render(<App />);
  // expect app to be rendered
  expect(wrapper).toBeTruthy();

  // 2 - login user
  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const submitButton = screen.getByRole("button", { name: /login/i });
  fireEvent.change(emailInput, { target: { value: "sdfsd@email.com" } });
  fireEvent.change(passwordInput, { target: { value: "123" } });
  fireEvent.click(submitButton);
  // expect user to be redirected to dashboard
  await waitFor(() => expect(window.location.pathname).toBe("/dashboard"));

  // 3 - check links in navigation bar
  // click on forum link
  const forumLink = screen.getByRole("link", { name: /forum/i });
  fireEvent.click(forumLink);
  // expect user to be redirected to forum
  await waitFor(() => expect(window.location.pathname).toBe("/forum/home"));

  // click back to dashboard
  const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
  fireEvent.click(dashboardLink);
  // expect user to be redirected to dashboard
  await waitFor(() => expect(window.location.pathname).toBe("/dashboard"));

  // click to open profile dropdown
  const profileDropdownToggle = screen.getByRole("button", { name: /profile/i });
  fireEvent.click(profileDropdownToggle);
  // expect profile dropdown to be visible with profile and settings links, and logout button
  const profileLink = screen.getByRole("link", { name: /profile/i });
  expect(profileLink).toBeInTheDocument();
  let settingsLink = screen.getByRole("link", { name: /settings/i });
  expect(settingsLink).toBeInTheDocument();
  let logoutButton = screen.getByRole("button", { name: /logout/i });
  expect(logoutButton).toBeInTheDocument();

  // click on profile link
  fireEvent.click(profileLink);
  // expect user to be redirected to profile page
  await waitFor(() => expect(window.location.pathname).toBe("/forum/u/summary"));
  // expect data to be fetched
  screen.debug();

  // click on settings link
  fireEvent.click(profileDropdownToggle);
  settingsLink = screen.getByRole("link", { name: /settings/i });
  fireEvent.click(settingsLink);
  // expect user to be redirected to settings page
  await waitFor(() => expect(window.location.pathname).toBe("/settings"));

  fireEvent.click(dashboardLink);
  // expect user to be redirected to dashboard
  await waitFor(() => expect(window.location.pathname).toBe("/dashboard"));

  // 4 - check links in section tiles
  // click on learning paths tile
  const learningPathsTile = screen.getByRole("link", { name: /learning paths/i });
  fireEvent.click(learningPathsTile);
  // expect user to be redirected to learning paths page
  await waitFor(() => expect(window.location.pathname).toBe("/dashboard/lp"));

  // click back to dashboard
  fireEvent.click(dashboardLink);
  // expect user to be redirected to dashboard
  await waitFor(() => expect(window.location.pathname).toBe("/dashboard"));

  // click on assessments tile
  const assessmentsTile = screen.getByRole("link", { name: /assessments/i });
  fireEvent.click(assessmentsTile);
  // expect user to be redirected to assessments page
  await waitFor(() => expect(window.location.pathname).toBe("/dashboard/assessments"));
  // expect assessments page to have heading
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/your assessments/i);

  // click on logout button
  fireEvent.click(profileDropdownToggle);
  logoutButton = screen.getByRole("button", { name: /logout/i });
  fireEvent.click(logoutButton);
  // expect user to be redirected to login page
  await waitFor(() => expect(window.location.pathname).toBe("/"));
  // expect data to be cleared from local storage
  expect(localStorage.getItem("token")).toBeNull();
});
