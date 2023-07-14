import { fireEvent, render, screen } from "../../test-utils";
import Login from "./index";

describe("Login", () => {
  beforeAll(() => {
    window.matchMedia =
      window.matchMedia ||
      function () {
        return {
          matches: false,
          addListener: function () {},
          removeListener: function () {},
        };
      };
  });
  beforeEach(() => {
    render(<Login />);
  });

  test("Renders correctly", () => {
    render(<Login />);
  });

  test("login left side image", () => {
    const loginImage = screen.getByRole("img", { name: /signupimage/i });
    expect(loginImage).toBeInTheDocument();
  });

  test("MasaiLogo", () => {
    const masaiLogo = screen.getByRole("img", { name: /logo/i });
    expect(masaiLogo).toBeInTheDocument();
  });

  test("is login routing working?", () => {
    const SignupRouting = screen.getByRole("button", {
      name: /Don't have account, Create Here/i,
    });
    fireEvent.click(SignupRouting);
    expect(window.location.pathname).toBe("/");
  });


})